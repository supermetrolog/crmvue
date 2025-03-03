<template>
    <AccordionSimple opened>
        <template #title>
            <AccordionSimpleTriggerButton
                button-class="messenger-quiz-template__accordion"
                :label
            />
        </template>
        <template #body>
            <div class="messenger-quiz-template__accordion-body">
                <slot />
            </div>
        </template>
    </AccordionSimple>
</template>
<script setup>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';

defineProps({
    label: {
        type: String,
        required: true
    }
});
</script>
