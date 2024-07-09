<template>
    <VTab ref="tab" v-bind="$attrs">
        <slot v-if="isActive" />
    </VTab>
</template>
<script setup>
import { Tab as VTab } from 'vue3-tabs-component';
import { computed, ref } from 'vue';

const tab = ref(null);
const isActive = computed(() => tab.value?.isActive ?? false);
</script>
