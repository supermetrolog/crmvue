<template>
    <div class="messenger-quiz-question">
        <AccordionSimple ref="accordion" opened>
            <template #title>
                <div class="messenger-quiz-question__header">
                    <MessengerQuizQuestionSuccessIcon v-if="isNotNullish(mainAnswer)" />
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
                        <RadioChip v-model="mainAnswer" :value="true" unselect label="Да" />
                        <RadioChip
                            v-model="mainAnswer"
                            @click.prevent="$emit('set-as-unavailable')"
                            :value="false"
                            unselect
                            label="Нет"
                            class="messenger-quiz-question__main"
                        />
                    </div>
                    <AccordionSimpleTrigger />
                </div>
            </template>
            <template #body>
                <div class="messenger-quiz-question__additions d-flex gap-1">
                    <CheckboxChip
                        @click.prevent="$emit('delete-contact')"
                        :disabled="isDisabled"
                        text="Удалить контакт"
                    />
                    <CheckboxChip
                        @click.prevent="$emit('move-contact')"
                        :disabled="isDisabled"
                        text="Перенести"
                    />
                    <CheckboxChip
                        @click.prevent="$emit('schedule-call')"
                        :disabled="isDisabled"
                        text="Запланировать звонок"
                    />
                </div>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import { computed, ref, useTemplateRef, watch } from 'vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import MessengerQuizQuestionSuccessIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionSuccessIcon.vue';
import MessengerQuizQuestionDangerIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionDangerIcon.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';

defineEmits(['set-as-unavailable', 'schedule-call', 'move-contact', 'delete-contact']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

// answers

const mainAnswer = ref(null);

const isDisabled = computed(() => Boolean(mainAnswer.value));

// suggest

watch(
    () => props.contact?.id,
    () => {
        mainAnswer.value = null;
    }
);

// accordion

const accordion = useTemplateRef('accordion');

watch(isDisabled, () => {
    accordion.value?.toggle();
});
</script>
