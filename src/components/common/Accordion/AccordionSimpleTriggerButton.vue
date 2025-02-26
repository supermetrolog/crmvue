<template>
    <AccordionSimpleTrigger>
        <DashboardChip class="accordion-simple-trigger-button w-100 dashboard-bg-light">
            <div class="d-flex justify-content-center align-items-center gap-2">
                <i v-if="icon" :class="icon" />
                <span>{{ label }}</span>
                <AccordionSimpleTriggerIcon />
            </div>
        </DashboardChip>
    </AccordionSimpleTrigger>
</template>
<script setup>
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';

defineProps({
    label: { type: String, default: 'Подробнее' },
    icon: String
});
</script>
