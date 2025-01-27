<template>
    <div class="messenger-quiz-question">
        <AccordionSimple ref="accordion" opened>
            <template #title>
                <div class="messenger-quiz-question__header">
                    <MessengerQuizQuestionSuccessIcon v-if="hasFullAnswer" />
                    <MessengerQuizQuestionWarningIcon v-else-if="hasNegativeAnswer" />
                    <MessengerQuizQuestionDangerIcon v-else />
                    <p class="messenger-quiz-question__title">
                        <span class="mr-1">Удалось дозвониться до</span>
                        <Tippy interactive :interactive-border="20">
                            <template #default>
                                <span class="messenger-quiz-question__contact">
                                    {{ contact.first_name }}
                                </span>
                            </template>
                            <template #content>
                                <ContactCard :contact="contact" />
                            </template>
                        </Tippy>
                        <span>?</span>
                    </p>
                    <div class="messenger-quiz-question__main d-flex gap-1">
                        <RadioChip v-model="form.available" :value="true" unselect label="Да" />
                        <RadioChip v-model="form.available" :value="false" unselect label="Нет" />
                    </div>
                    <AccordionSimpleTrigger />
                </div>
            </template>
            <template #body>
                <AnimationTransition :speed="0.25">
                    <div v-if="hasNegativeAnswer">
                        <div class="messenger-quiz-question__additions d-flex align-items-start">
                            <RadioOptions
                                v-model="form.reason"
                                :v="v$.reason"
                                required
                                :options="REASON_OPTIONS"
                            />
                            <MessengerQuizQuestionCallSchedule
                                @click="$emit('toggle-call-schedule')"
                                :scheduled-date="form.scheduled"
                                class="ml-2"
                            />
                        </div>
                    </div>
                    <div v-else>
                        <div class="messenger-quiz-question__additions d-flex align-items-start">
                            <RadioChip
                                v-model="form.action"
                                :value="1"
                                label="Удалить контакт"
                                unselect
                            />
                            <RadioChip
                                v-model="form.action"
                                :value="2"
                                label="Перенести"
                                unselect
                            />
                            <MessengerQuizQuestionCallSchedule
                                @click="$emit('toggle-call-schedule')"
                                :scheduled-date="form.scheduled"
                                class="ml-2"
                            />
                        </div>
                        <AnimationTransition :speed="0.25">
                            <Textarea
                                v-if="form.action"
                                v-model="form.description"
                                placeholder="Подробности о контакте. Почему удалить/перенести?"
                                :min-height="60"
                                auto-height
                            />
                        </AnimationTransition>
                    </div>
                </AnimationTransition>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import { computed, toRef, watch } from 'vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import MessengerQuizQuestionSuccessIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionSuccessIcon.vue';
import MessengerQuizQuestionDangerIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionDangerIcon.vue';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import MessengerQuizQuestionWarningIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionWarningIcon.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import Textarea from '@/components/common/Forms/Textarea.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import MessengerQuizQuestionCallSchedule from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionCallSchedule.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import { useValidationNotify } from '@/composables/useValidationNotify.js';

const form = defineModel('form');

defineEmits(['set-as-unavailable', 'toggle-call-schedule', 'move-contact', 'delete-contact']);

defineProps({
    contact: {
        type: Object,
        required: true
    }
});

// answers

const hasNegativeAnswer = computed(() => form.value.available === false);
const hasPositiveAnswer = computed(() => form.value.available === true);

const hasFullAnswer = computed(
    () => hasPositiveAnswer.value || (isNotNullish(form.value.reason) && hasNegativeAnswer.value)
);

const REASON_OPTIONS = {
    1: 'Не отвечает',
    2: 'Не доступен',
    3: 'Заблокирован'
};

const v$ = useVuelidate(
    {
        reason: {
            required: helpers.withMessage(
                `Выберите причину недозвона`,
                requiredIf(() => hasNegativeAnswer.value)
            )
        },
        available: {
            required: helpers.withMessage('Укажите, удалось ли дозвониться до клиента', required)
        }
    },
    form
);

function resetForm() {
    form.value.reason = null;
    form.value.description = null;
    form.value.action = null;
}

watch(
    () => form.value.available,
    (newValue, oldValue) => {
        if (isNullish(oldValue) && !newValue) form.value.description = null;
        else if (isNotNullish(oldValue) && isNotNullish(newValue)) {
            resetForm();
        }
    }
);

const { validateWithNotify } = useValidationNotify(v$);

defineExpose({
    validate() {
        validateWithNotify();
        return !v$.value.$error;
    }
});
</script>
