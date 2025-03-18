<template>
    <UiAccordion ref="accordion" :title="label" opened>
        <template #body="{ opened, toggle }">
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
                    <UiAccordionButton
                        @click="toggle"
                        class="w-50"
                        :label="footerLabel"
                        :opened="opened"
                    />
                    <DashboardChip
                        @click="expanded = !expanded"
                        class="accordion-simple-trigger-button w-50 dashboard-bg-light c-pointer"
                    >
                        <div
                            class="d-flex justify-content-center align-items-center text-center gap-2"
                        >
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
    </UiAccordion>
</template>
<script setup>
import { ref, useTemplateRef } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiAccordionButton from '@/components/common/UI/Accordion/UiAccordionButton.vue';

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

const accordionEl = useTemplateRef('accordion');

function close() {
    accordionEl.value.close();
}

defineExpose({ close });
</script>
