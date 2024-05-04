<template>
    <AccordionSimple class="messenger-quiz-helper__section">
        <template #title>
            <AccordionSimpleTrigger class="messenger-quiz-helper__question">
                <p>{{ section.title }}</p>
                <AccordionSimpleTriggerIcon />
            </AccordionSimpleTrigger>
        </template>
        <template #body>
            <ol class="messenger-quiz-helper__list">
                <li
                    v-for="(question, key) in section.questions"
                    :key="key"
                    class="messenger-quiz-helper__row"
                >
                    <span>- {{ question }}</span>
                </li>
            </ol>
        </template>
    </AccordionSimple>
</template>
<script>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';

export default {
    name: 'MessengerQuizHelperSection',
    components: { AccordionSimpleTriggerIcon, AccordionSimpleTrigger, AccordionSimple },
    props: {
        section: {
            type: Object,
            required: true
        }
    }
};
</script>
