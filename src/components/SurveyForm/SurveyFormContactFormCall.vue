<template>
    <div class="survey-form-contact-form-call">
        <div
            class="survey-form-contact-form-call__question"
            data-tour-id="survey-form:stepper-contact-question"
        >
            <p class="survey-form-contact-form-call__question-text mb-2">Дозвонились?</p>
            <div class="d-flex gap-1 align-items-center">
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
                <UiDropdownActions title="Выберите событие">
                    <template #trigger>
                        <UiButton
                            icon="fa-solid fa-calendar-plus"
                            small
                            color="transparent"
                            class="survey-form-contact-form-call__schedule ml-2"
                        >
                            Запланировать событие
                        </UiButton>
                    </template>
                    <template #menu>
                        <UiDropdownActionsButton
                            @handle="$emit('schedule-call')"
                            :icon="form.scheduled ? 'fa-solid fa-check' : 'fa-solid fa-phone'"
                            :label="form.scheduled ? 'Звонок запланирован' : 'Звонок'"
                            :disabled="!!form.scheduled"
                        />
                        <UiDropdownActionsButton
                            @handle="$emit('schedule-visit')"
                            :icon="form.visit ? 'fa-solid fa-check' : 'fa-solid fa-people-arrows'"
                            :label="form.visit ? 'Встреча запланирована' : 'Встреча'"
                            :disabled="!!form.visit"
                        />
                        <UiDropdownActionsButton
                            @handle="$emit('schedule-event')"
                            :icon="form.event ? 'fa-solid fa-check' : 'fa-solid fa-calendar-plus'"
                            :label="form.event ? 'Действие запланировано' : 'Действие'"
                            :disabled="!!form.event"
                        />
                    </template>
                </UiDropdownActions>
            </div>
        </div>
        <AnimationTransition :speed="0.3">
            <div v-if="hasAnyAnswer" class="mt-2">
                <MultiSelect
                    v-model="reason"
                    placeholder="Выберите результат звонка.."
                    :options="available ? availableReasonOptions : unavailableReasonOptions"
                    required
                    :v="v$.reason"
                    class="mb-2"
                />
                <AnimationTransition :speed="0.3">
                    <div v-if="descriptionShouldBeVisible">
                        <UiTextarea
                            v-model="form.description"
                            placeholder="Комментарий к задаче.."
                            class="mb-2 survey-form-contact-form-call__editor"
                            :min-height="80"
                            :max-height="120"
                            auto-height
                        />
                    </div>
                </AnimationTransition>
            </div>
        </AnimationTransition>
    </div>
</template>
<script setup>
import { computed, watch } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import useVuelidate from '@vuelidate/core';
import { helpers, requiredIf } from '@vuelidate/validators';
import { isString } from '@/utils/helpers/string/isString.js';
import { toBool } from '@/utils/helpers/string/toBool.js';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { plural } from '@/utils/plural.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';

const emit = defineEmits(['schedule-call', 'change', 'schedule-visit', 'schedule-event']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    company: Object,
    phoneId: Number
});

const form = defineModel({ type: Object, default: () => ({}) });

const reason = computed({
    get() {
        if (isNotNullish(form.value.reason)) {
            return Number(form.value.reason);
        }

        return null;
    },
    set(value) {
        if (isNotNullish(value)) {
            form.value.reason = Number(value);
        } else {
            form.value.reason = value;
        }
    }
});

const available = computed({
    get() {
        if (isNotNullish(form.value?.available)) {
            if (isString(form.value.available)) {
                return toBool(form.value.available);
            }

            return form.value.available;
        }

        return null;
    },
    set(value) {
        form.value.available = value;
    }
});

const descriptionShouldBeVisible = computed(
    () => available.value && isNotNullish(reason.value) && reason.value !== 1
);

const contactCanNotBeDeletedReasons = new Set([1, 3]);
const contactMustBeDeletedReasons = new Set([2, 7, 8]);

function handleDeleteByStatus(status) {
    form.value.delete = lastCallsCount >= 5 && lastCallsStatus === status;
}

watch(reason, value => {
    if (isNotNullish(value)) {
        if (contactCanNotBeDeletedReasons.has(value)) {
            form.value.delete = false;
        } else if (contactMustBeDeletedReasons.has(value)) {
            form.value.delete = true;
        } else {
            if (value === 4) handleDeleteByStatus(callStatusMap.MISSED);
            else if (value === 5) handleDeleteByStatus(callStatusMap.NOT_AVAILABLE);
            else if (value === 6) handleDeleteByStatus(callStatusMap.BUSY);
        }
    } else {
        form.value.delete = false;
    }
});

watch(available, value => {
    if (isNotNullish(value)) emit('change');
    reason.value = null;
});

const hasAnyAnswer = computed(() => isNotNullish(available.value));

const callStatusMap = {
    MISSED: 0,
    COMPLETED: 1,
    BUSY: 2,
    NOT_AVAILABLE: 3,
    REJECTED: 4,
    ANGRY: 5,
    BLOCKED: 6
};

const currentCalls = computed(() =>
    props.contact.calls.filter(call => call.phone_id === props.phoneId)
);

const completedCallsCount = computed(() =>
    currentCalls.value.reduce(
        (acc, call) => acc + Number(call.status === callStatusMap.COMPLETED),
        0
    )
);

let lastCallsCount = 1;
let pluralLastCallsCount = '1 попытка';
const lastCallsStatus = currentCalls.value[0]?.status;

function handleCalls() {
    for (let i = 1; i < currentCalls.value.length; i++) {
        if (currentCalls.value[i].status === currentCalls.value[i - 1].status) {
            lastCallsCount++;
        } else {
            pluralLastCallsCount = plural(lastCallsCount, '%d попытка', '%d попытки', '%d попыток');
            break;
        }
    }
}

handleCalls();

const companyName = computed(() =>
    props.company ? getCompanyShortName(props.company) : `Компании #${props.contact.company_id}`
);

function createAvailableReasonOptionActualized() {
    const option = {
        value: 1,
        label: `Актуален - контакт работает в ${companyName.value}`,
        icon: 'fa-solid fa-thumbs-up'
    };

    if (completedCallsCount.value > 0) {
        option.after = `(${plural(completedCallsCount.value, '%d разговор', '%d разговора', '%d разговоров')})`;
        option.afterClass = 'text-success';
    }

    return option;
}

const availableReasonOptions = [
    createAvailableReasonOptionActualized(),
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

function createAvailableReasonOptionMissed() {
    const option = {
        value: 4,
        label: 'Не поднимает',
        icon: 'fa-solid fa-phone'
    };

    if (lastCallsStatus === callStatusMap.MISSED) {
        if (pluralLastCallsCount >= 5) {
            option.after = `(${pluralLastCallsCount}. Перенести в архив)`;
            option.afterClass = 'text-danger';
        } else {
            option.after = `(${pluralLastCallsCount})`;
            option.afterClass = 'text-warning';
        }
    }

    return option;
}

function createAvailableReasonOptionUnavailable() {
    const option = {
        value: 5,
        label: 'Недоступен',
        icon: 'fa-solid fa-phone-slash'
    };

    if (lastCallsStatus === callStatusMap.NOT_AVAILABLE) {
        if (pluralLastCallsCount >= 5) {
            option.after = `(${pluralLastCallsCount}. Перенести в архив)`;
            option.afterClass = 'text-danger';
        } else {
            option.after = `(${pluralLastCallsCount})`;
            option.afterClass = 'text-warning';
        }
    }

    return option;
}

function createAvailableReasonOptionBusy() {
    const option = {
        value: 6,
        label: 'Занят',
        icon: 'fa-solid fa-user-clock'
    };

    if (lastCallsStatus === callStatusMap.BUSY) {
        if (pluralLastCallsCount >= 5) {
            option.after = `(${pluralLastCallsCount}. Перенести в архив)`;
            option.afterClass = 'text-danger';
        } else {
            option.after = `(${pluralLastCallsCount})`;
            option.afterClass = 'text-warning';
        }
    }

    return option;
}

const unavailableReasonOptions = [
    createAvailableReasonOptionMissed(),
    createAvailableReasonOptionBusy(),
    createAvailableReasonOptionUnavailable(),
    {
        value: 7,
        label: 'Не существует/не зарегистрирован',
        icon: 'fa-solid fa-ban',
        after: '(Перенести в архив)',
        afterClass: 'text-danger'
    },
    {
        value: 8,
        label: 'Заблокирован',
        icon: 'fa-solid fa-user-slash',
        after: '(Перенести в архив)',
        afterClass: 'text-danger'
    }
];

const v$ = useVuelidate(
    {
        reason: {
            required: helpers.withMessage(
                `Необходимо указать результат звонка`,
                requiredIf(hasAnyAnswer)
            )
        }
    },
    form
);
</script>
