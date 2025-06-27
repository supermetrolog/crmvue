<template>
    <div class="messenger-panel-company__tab">
        <AccordionSimple without-render :opened="opened">
            <template #title="{ toggle }">
                <div
                    @click="toggle"
                    class="messenger-aside-section__header messenger-panel-company__heading"
                >
                    <div class="messenger-aside-heading">
                        <AccordionSimpleTrigger static />
                        <span class="messenger-aside-heading__title">
                            {{ title }}
                            <span>
                                <span>(</span>
                                <template v-if="hasActiveCount">
                                    <span class="text-success">{{ activeCount }}</span>
                                    <span>/</span>
                                </template>
                                <span :class="{ 'text-danger': hasActiveCount }">
                                    {{ calculatedTotalCount }}
                                </span>
                                <span>)</span>
                            </span>
                        </span>
                    </div>
                    <div v-if="$slots.actions" class="ml-auto d-flex gap-1 align-items-center">
                        <slot name="actions"></slot>
                    </div>
                    <MessengerLoader :active="loading" />
                </div>
            </template>
            <template #body>
                <slot></slot>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import MessengerLoader from '@/components/Messenger/MessengerLoader.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    totalCount: {
        type: Number,
        default: 0
    },
    activeCount: Number,
    loading: Boolean,
    opened: Boolean
});

const hasActiveCount = computed(
    () => isNotNullish(props.activeCount) && props.activeCount + props.totalCount !== 0
);

const calculatedTotalCount = computed(() => {
    if (hasActiveCount.value) return props.totalCount - props.activeCount;
    return props.totalCount;
});
</script>
