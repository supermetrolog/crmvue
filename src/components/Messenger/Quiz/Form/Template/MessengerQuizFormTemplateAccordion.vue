<template>
    <AccordionSimple opened>
        <template #title="{ opened }">
            <AccordionSimpleTriggerButton v-if="!opened" :label />
            <span v-else></span>
        </template>
        <template #body>
            <slot>
                <div v-if="$slots.actions" class="d-flex gap-1 px-1 pt-1 mb-1">
                    <slot name="actions"></slot>
                </div>
                <div
                    v-if="$slots.items"
                    :class="[listClass, { expanded: expanded }]"
                    class="messenger-quiz-question__list px-1"
                >
                    <slot name="items" />
                </div>
                <div class="d-flex gap-1 mt-1">
                    <AccordionSimpleTriggerButton class="w-50" :label="footerLabel" />
                    <DashboardChip
                        @click="expanded = !expanded"
                        class="accordion-simple-trigger-button w-50 dashboard-bg-light c-pointer"
                    >
                        <div class="d-flex justify-content-center align-items-center gap-2">
                            <template v-if="expanded">
                                <span>Свернуть список</span>
                                <i class="fa-solid fa-down-left-and-up-right-to-center"></i>
                            </template>
                            <template v-else>
                                <span>Развернуть все</span>
                                <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                            </template>
                        </div>
                    </DashboardChip>
                </div>
            </slot>
        </template>
    </AccordionSimple>
</template>
<script setup>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import { ref } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineProps({
    label: {
        type: String,
        required: true
    },
    footerLabel: {
        type: String,
        required: true
    },
    listClass: {
        type: [String, Object, Array]
    }
});

const expanded = ref(false);
</script>
