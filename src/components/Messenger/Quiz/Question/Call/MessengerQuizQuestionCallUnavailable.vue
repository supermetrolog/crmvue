<template>
    <div class="messenger-quiz-question">
        <div class="messenger-quiz-question__header">
            <MessengerQuizQuestionSuccessIcon />
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
                <RadioChip v-model="mainAnswer" :value="true" label="Да" disabled />
                <RadioChip v-model="mainAnswer" :value="false" label="Нет" disabled />
            </div>
            <AccordionSimpleTrigger />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import MessengerQuizQuestionSuccessIcon from '@/components/Messenger/Quiz/Question/Icons/MessengerQuizQuestionSuccessIcon.vue';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';

defineProps({
    contact: {
        type: Object,
        required: true
    },
    callScheduled: Boolean
});

const mainAnswer = ref(false);
</script>
