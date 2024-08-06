<template>
    <AccordionSimpleTrigger>
        <DashboardChip class="accordion-simple-trigger-button w-100 dashboard-bg-light">
            <div class="d-flex justify-content-center gap-2">
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

defineProps({ label: { type: String, default: 'Подробнее' } });
</script>
