<template>
    <UiModal
        v-model:visible="visible"
        @close="cancel"
        :width="800"
        :close-on-press-esc="false"
        :close-on-outside-click="false"
        title="Результат звонка"
        custom-close
    >
        <div
            class="messenger-quiz-question-call mb-1"
            :class="{ active: hasPositiveAnswer, passive: hasNegativeAnswer }"
        >
            <div class="messenger-quiz-question__header">
                <p class="messenger-quiz-question__title">
                    <span class="mr-1">Удалось ли дозвониться до</span>
                    <Tippy interactive :interactive-border="20">
                        <template #default>
                            <span class="messenger-quiz-question__contact">
                                {{ model.entity.first_name }}
                            </span>
                        </template>
                        <template #content>
                            <ContactCard :contact="model.entity" />
                        </template>
                    </Tippy>
                    <span>?</span>
                </p>
                <div class="messenger-quiz-question__main d-flex gap-1">
                    <MessengerQuizFormRadioChip
                        v-model="model.form.available"
                        :value="true"
                        label="Да"
                    />
                    <MessengerQuizFormRadioChip
                        v-model="model.form.available"
                        :value="false"
                        label="Нет"
                    />
                </div>
            </div>
        </div>
        <RadioOptions
            v-model="model.form.reason"
            :v="v$.reason"
            required
            unselect
            :options="model.form.available ? availableReasonOptions : unavailableReasonOptions"
            label="Результат по контакту"
            show-radio
            :rounded="false"
            class="mb-2"
            :disabled="!hasAnyAnswer"
        />
        <AnimationTransition :speed="0.3">
            <UiTextarea
                v-if="model.form.reason === 2 || model.form.reason === 3"
                v-model="model.form.description"
                label="Описание"
                placeholder="Почему удалить или в какую компанию перенести?"
                class="mb-2"
                :min-height="50"
                :max-height="120"
                auto-height
            />
        </AnimationTransition>
        <p class="mb-2 font-weight-semi">Действия:</p>
        <MessengerQuizQuestionCallSchedule
            @schedule="$emit('schedule-call')"
            :scheduled-date="form.scheduled"
        />
        <template #actions>
            <UiButton
                @click="submit"
                :disabled="!model.form?.reason"
                color="success-light"
                icon="fa-solid fa-check"
                bolder
            >
                <span v-if="model.form.available && model.form.reason === 1">
                    Перейти к вопросам
                </span>
                <span v-else-if="model.form.available && model.form.reason === 4">Завершить</span>
                <span v-else-if="canGoToNext">Выбрать другой контакт</span>
                <span v-else>Завершить</span>
            </UiButton>
            <UiButton @click="cancel" color="light" icon="fa-solid fa-ban" bolder>
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed, toRef } from 'vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useValidationNotify } from '@/composables/useValidationNotify.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import MessengerQuizFormRadioChip from '@/components/Messenger/Quiz/Form/MessengerQuizFormRadioChip.vue';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import { Tippy } from 'vue-tippy';
import MessengerQuizQuestionCallSchedule from '@/components/Messenger/Quiz/Question/Call/MessengerQuizQuestionCallSchedule.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const visible = defineModel('visible');
const model = defineModel('form');

const emit = defineEmits([
    'confirm',
    'cancel',
    'schedule-call',
    'call-scheduled',
    'next-contact',
    'finish'
]);

const props = defineProps({
    contacts: {
        type: Array,
        default: () => []
    },
    canGoToNext: Boolean
});

const hasAnyAnswer = computed(() => isNotNullish(model.value.form.available));
const hasPositiveAnswer = computed(() => model.value.form.available === true);
const hasNegativeAnswer = computed(() => model.value.form.available === false);

const availableReasonOptions = {
    1: 'Актуален',
    2: 'Удалить',
    3: 'Перенести',
    4: 'Перезвоню'
};

const unavailableReasonOptions = {
    2: 'Удалить',
    3: 'Перенести',
    4: 'Перезвоню'
};

const v$ = useVuelidate(
    {
        reason: {
            required: helpers.withMessage(`Необходимо указать результат звонка`, required)
        }
    },
    {
        reason: toRef(() => model.value?.form?.reason)
    }
);

const { validateWithNotify } = useValidationNotify(v$);

function submit() {
    validateWithNotify();
    if (v$.value.$invalid) return;

    if (model.value.form.available) {
        if (model.value.form.reason === 1) {
            emit('confirm');
            return;
        }

        if (model.value.form.reason === 4) {
            emit('call-scheduled');
            return;
        }

        if (props.canGoToNext) {
            emit('next-contact');
            return;
        }

        emit('finish');
    } else {
        if (model.value.form.reason === 4) {
            emit('call-scheduled');
            return;
        }

        if (props.canGoToNext) {
            emit('next-contact');
            return;
        }

        emit('finish');
    }
}

const { confirm } = useConfirm();

async function cancel() {
    if (isNotNullish(model.value.form.reason)) {
        const confirmed = await confirm({
            title: 'Отменить звонок',
            message: 'Вы уверены что хотите отменить заполнение звонка?',
            okButton: 'Да, отменить'
        });

        if (!confirmed) return;
    }

    model.value.form.available = null;
    model.value.form.reason = null;

    emit('cancel');
}
</script>
