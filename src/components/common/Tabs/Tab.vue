<template>
    <VTab
        ref="tab"
        v-bind="$attrs"
        :suffix="required ? '<span class=\'tabs-component-tab-required\'>*</span>' : undefined"
    >
        <template v-if="!withTransition">
            <slot v-if="alwaysRender || isActive" />
        </template>
        <AnimationTransition v-else :speed="2">
            <slot v-if="alwaysRender || isActive" />
        </AnimationTransition>
    </VTab>
</template>
<script setup>
import { Tab as VTab } from 'vue3-tabs-component';
import { computed, inject, ref } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

defineProps({ required: Boolean });

const alwaysRender = inject('always-render', false);
const withTransition = inject('with-transition', false);
const tab = ref(null);
const isActive = computed(() => tab.value?.isActive ?? false);
</script>
