<template>
    <table
        class="table position-relative"
        :class="{ 'table--fluid': fluid, 'table--shadow': shadow }"
    >
        <thead>
            <slot name="thead" />
            <div v-if="localeRefreshing" class="table__progress">
                <UiButton small color="light" :loading="refreshing"> Обновление данных</UiButton>
            </div>
        </thead>
        <tbody>
            <slot name="tbody" />
        </tbody>
    </table>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { ref, watch } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import { ColumnWidths } from '@/components/common/Table/storage';
import { createTableColumnWidthContext } from '@/composables/useTableColumnWidth';

const props = defineProps<{
    fluid?: boolean;
    shadow?: boolean;
    refreshing?: boolean;
    resizable?: boolean;
    storageKey?: string;
    defaultWidths?: ColumnWidths;
    constraints?: Record<string, { min?: number; max?: number }>;
}>();

// refreshing

const localeRefreshing = ref(props.refreshing);

const { start: stopLoading, stop: clearLoadingTimeout } = useTimeoutFn(
    () => {
        localeRefreshing.value = false;
    },
    1000,
    { immediate: false }
);

watch(
    () => props.refreshing,
    value => {
        if (value) {
            localeRefreshing.value = true;
            clearLoadingTimeout();
        } else {
            stopLoading();
        }
    }
);

// storage
createTableColumnWidthContext({
    storageKey: () => props.storageKey ?? 'default',
    defaultWidths: () => props.defaultWidths,
    constraints: () => props.constraints ?? {},
    resizable: () => props.resizable
});
</script>
<style>
body.resizing-col * {
    user-select: none !important;
    cursor: col-resize !important;
}
</style>
