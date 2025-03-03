<template>
    <AccordionSimple :opened>
        <template #title>
            <AccordionSimpleTriggerButton :label />
        </template>
        <template #body>
            <div class="d-flex flex-column gap-1 my-1">
                <slot />
            </div>
            <AccordionSimpleTriggerButton :label="closeLabel" />
        </template>
    </AccordionSimple>
</template>
<script setup>
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';

defineProps({
    label: {
        type: String,
        required: true
    },
    opened: {
        type: Boolean,
        default: true
    },
    closeLabel: {
        type: String,
        default: 'Закрыть список'
    }
});
</script>
