<template>
    <table class="table" :class="{ 'table--fluid': fluid, 'table--shadow': shadow }">
        <thead class="position-relative">
            <slot name="thead" />
            <div v-if="localeRefreshing" class="table__progress">
                <UiButton small color="light" :loading="refreshing"> Обновление данных </UiButton>
            </div>
        </thead>
        <tbody>
            <slot name="tbody" />
        </tbody>
    </table>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { ref, watch } from 'vue';
import { useTimeoutFn } from '@vueuse/core';

const props = defineProps({
    fluid: Boolean,
    shadow: Boolean,
    refreshing: Boolean
});

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
</script>
