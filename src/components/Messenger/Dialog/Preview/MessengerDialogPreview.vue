<template>
    <div class="messenger-dialog-preview">
        <AccordionSimple :opened="opened" without-render>
            <template #title>
                <AccordionSimpleTriggerButton label="Характеристики" />
            </template>
            <template #body>
                <div class="messenger-dialog-preview__content">
                    <slot />
                </div>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';

defineProps({
    opened: {
        type: Boolean,
        default: false
    }
});
</script>
