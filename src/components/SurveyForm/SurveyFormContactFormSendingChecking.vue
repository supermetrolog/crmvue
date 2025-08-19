<template>
    <div class="survey-form-contact-form-call">
        <div
            class="survey-form-contact-form-call__question"
            data-tour-id="survey-form:stepper-contact-question"
        >
            <p class="survey-form-contact-form-call__question-text mb-2">
                Получен ответ на это письмо?
            </p>
            <div class="d-flex gap-1">
                <RadioChip v-model="available"
:value="true"
unselect
label="Да"
:rounded="false" />
                <RadioChip
                    v-model="available"
                    :value="false"
                    unselect
                    label="Нет"
                    :rounded="false"
                />
            </div>
        </div>
        <AnimationTransition :speed="0.3">
            <RadioOptions
                v-if="available"
                ref="waySelectEl"
                v-model="way"
                :v="v$.way"
                :options="wayOptions"
                :rounded="false"
                required
                show-radio
                class="my-1"
                label="Способ ответа на письмо"
            />
        </AnimationTransition>
        <AnimationTransition :speed="0.3">
            <MultiSelect
                v-if="reasonSelectIsVisible"
                ref="reasonSelectEl"
                v-model="reason"
                :v="v$.reason"
                :placeholder="
                    available
                        ? 'Выберите результат ответа на письмо..'
                        : 'Выберите дальнейшее действие над контактом..'
                "
                :options="available ? availableReasonOptions : unavailableReasonOptions"
                required
                :label="available ? 'Результат ответа на письмо' : 'Действие над контактом'"
                class="my-2"
            />
        </AnimationTransition>
        <AnimationTransition :speed="0.3">
            <UiTextarea
                v-if="commentIsVisible"
                v-model="comment"
                placeholder="Комментарий к ответу на письмо.."
                class="mb-2 survey-form-contact-form-call__editor"
                :min-height="80"
                :max-height="120"
                auto-height
            />
        </AnimationTransition>
        <AnimationTransition :speed="0.3">
            <div v-if="hasAnyAnswer && descriptionShouldBeVisible">
                <UiTextarea
                    v-model="form.description"
                    placeholder="Комментарий к задаче.."
                    label="Оформление задачи"
                    class="mb-2 survey-form-contact-form-call__editor"
                    :min-height="80"
                    :max-height="120"
                    auto-height
                />
            </div>
        </AnimationTransition>
        <AnimationTransition :speed="0.3">
            <div v-if="schedulerIsVisible">
                <p class="font-weight-semi mb-1">Планирование событий</p>
                <UiDropdownActions title="Выберите событие">
                    <template #trigger>
                        <UiButton icon="fa-solid fa-calendar-plus" small color="transparent">
                            Запланировать событие
                        </UiButton>
                    </template>
                    <template #menu>
                        <UiDropdownActionsButton
                            @handle="$emit('schedule-call')"
                            :icon="scheduled ? 'fa-solid fa-check' : 'fa-solid fa-phone'"
                            :label="scheduled ? 'Звонок запланирован' : 'Звонок'"
                            :disabled="scheduled"
                        />
                        <UiDropdownActionsButton
                            @handle="$emit('schedule-visit')"
                            :icon="visit ? 'fa-solid fa-check' : 'fa-solid fa-people-arrows'"
                            :label="visit ? 'Встреча запланирована' : 'Встреча'"
                            :disabled="visit"
                        />
                        <UiDropdownActionsButton
                            @handle="$emit('schedule-event')"
                            :icon="event ? 'fa-solid fa-check' : 'fa-solid fa-calendar-plus'"
                            :label="event ? 'Действие запланировано' : 'Действие'"
                            :disabled="event"
                        />
                    </template>
                </UiDropdownActions>
            </div>
        </AnimationTransition>
        <hr />
        <div>
            <AnimationTransition :speed="0.3">
                <UiButton
                    v-if="hasAnyAnswer"
                    @click="saveChecking"
                    :disabled="!canBeSaved"
                    :loading="isSaving"
                    class="mt-2"
                    color="success-light"
                    :icon="available ? 'fa-solid fa-check' : 'fa-solid fa-ban'"
                >
                    Отметить письмо {{ available ? 'прочитанным' : 'непрочитанным' }}
                </UiButton>
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup>
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import useVuelidate from '@vuelidate/core';
import { helpers, requiredIf } from '@vuelidate/validators';
import { toBool } from '@/utils/helpers/common/toBool';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import api from '@/api/api.js';
import { toServerDate } from '@/utils/formatters/date';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { isNullish } from '@/utils/helpers/common/isNullish';

const emit = defineEmits(['schedule-call', 'change', 'schedule-visit', 'schedule-event']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    letter: {
        type: Object,
        required: true
    },
    company: Object,
    phoneId: Number,
    surveyAction: Object,
    scheduled: Boolean,
    visit: Boolean,
    event: Boolean
});

const form = defineModel({
    type: Object,
    default: () => ({
        available: null,
        reason: null,
        description: null
    })
});

const reason = ref(null);
const available = ref(null);

const comment = ref(null);
const way = ref(null);

const wayOptions = {
    1: 'Ответ по Email',
    2: 'Обратный звонок',
    3: 'Иное (мессенджер, лично и т.д.)'
};

const descriptionShouldBeVisible = computed(
    () => available.value && isNotNullish(reason.value) && reason.value !== 1
);

const contactCanNotBeDeletedReasons = new Set([1, 3]);
const contactMustBeDeletedReasons = new Set([2]);

watch(reason, value => {
    if (isNotNullish(value)) {
        if (contactCanNotBeDeletedReasons.has(value)) {
            form.value.delete = false;
        } else if (contactMustBeDeletedReasons.has(value)) {
            form.value.delete = true;
        }
    } else {
        form.value.delete = false;
    }
});

const reasonSelectEl = useTemplateRef('reasonSelectEl');
const waySelectEl = useTemplateRef('waySelectEl');

watch(available, value => {
    if (isNotNullish(value)) {
        emit('change');

        if (toBool(value)) {
            nextTick(() => {
                waySelectEl.value?.$el.scrollIntoView({
                    behavior: 'smooth'
                });
            });
        } else {
            nextTick(() => {
                reasonSelectEl.value?.focus();
                reasonSelectEl.value?.scrollIntoView();
            });
        }
    }

    way.value = null;
    reason.value = null;
});

const hasAnyAnswer = computed(() => isNotNullish(available.value));

const companyName = computed(() =>
    props.company ? getCompanyShortName(props.company) : `Компании #${props.contact.company_id}`
);

const availableReasonOptions = [
    {
        value: 1,
        label: `Актуален - контакт работает в "${companyName.value}"`,
        icon: 'fa-solid fa-thumbs-up'
    },
    {
        value: 3,
        label: 'Актуален - но работает в другой компании',
        icon: 'fa-solid fa-rotate',
        after: '(Изменить компанию)',
        afterClass: 'text-danger'
    },
    {
        value: 2,
        label: 'Не актуален - не имеет отношения к недвижимости',
        icon: 'fa-solid fa-thumbs-down',
        after: '(Перенести в архив)',
        afterClass: 'text-danger'
    }
];

const unavailableReasonOptions = [
    {
        value: 4,
        label: 'Данная почта не актуальна'
    },
    {
        value: 5,
        label: 'Архивировать контакт'
    }
];

const v$ = useVuelidate(
    {
        reason: {
            required: helpers.withMessage(
                `Необходимо указать результат письма`,
                requiredIf(hasAnyAnswer)
            )
        }
    },
    form
);

const reasonSelectIsVisible = computed(() => {
    if (available.value) {
        return isNotNullish(way.value);
    }

    return isNotNullish(available.value);
});

const commentIsVisible = computed(() => {
    return available.value && isNotNullish(way.value);
});

const schedulerIsVisible = computed(() => {
    return (
        (available.value && isNotNullish(way.value)) ||
        (!available.value && isNotNullish(reason.value))
    );
});

watch(way, (value, oldValue) => {
    if (isNotNullish(value) && isNullish(oldValue)) {
        nextTick(() => {
            reasonSelectEl.value?.focus();
            reasonSelectEl.value?.scrollIntoView();
        });
    }
});

// save

const canBeSaved = computed(() => {
    return hasAnyAnswer.value && (!toBool(available.value) || isNotNullish(reason.value));
});

const isSaving = ref(false);

function createSurveyActionPayload() {
    return {
        status: available.value ? 'done' : 'canceled',
        completed_at: toServerDate(new Date()),
        target_id: props.surveyAction.target_id
    };
}

const wayOptionToValueMap = {
    1: 'email',
    2: 'call',
    3: 'other'
};

function createLetterContactAnswerPayload() {
    return {
        letter_contact_id: props.letter.id,
        comment: comment.value,
        type: wayOptionToValueMap[way.value]
    };
}

async function saveChecking() {
    isSaving.value = true;

    try {
        form.value.available = available.value;
        form.value.reason = reason.value;

        const action = await api.survey.updateAction(
            props.surveyAction.id,
            createSurveyActionPayload()
        );

        Object.assign(props.surveyAction, action);

        const answer = await api.letter.createContactAnswer(createLetterContactAnswerPayload());

        // eslint-disable-next-line vue/no-mutating-props
        props.letter.answers.push(answer);
    } finally {
        isSaving.value = false;
    }
}
</script>
