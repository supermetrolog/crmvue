<template>
    <YandexMapDrawerControl :settings>
        <slot />
    </YandexMapDrawerControl>
</template>
<script setup lang="ts">
import { YandexMapDrawerControl } from 'vue-yandex-maps';
import { computed } from 'vue';

const open = defineModel<boolean>('open');

const props = withDefaults(
    defineProps<{
        position?: 'left' | 'right' | 'top' | 'bottom';
        width?: number;
        height?: number | string;
    }>(),
    {
        position: 'left',
        width: 300
    }
);

const settings = computed(() => ({
    position: props.position,
    open: open.value,
    width: props.width,
    onOpenChange: (value: boolean) => {
        console.log('on open change', value);
        open.value = !value;
    },
    height: props.height
}));
</script>
