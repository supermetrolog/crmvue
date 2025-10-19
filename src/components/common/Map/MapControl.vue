<template>
    <YandexMapControlButton :settings="{ onClick, background }">
        <slot />
    </YandexMapControlButton>
</template>
<script setup lang="ts">
import { YandexMapControlButton } from 'vue-yandex-maps';
import { computed } from 'vue';
import { useMapContext } from '@/components/common/Map/useMapContext';

const emit = defineEmits<{
    (e: 'click'): void;
}>();

const props = defineProps<{
    active?: boolean;
}>();

function onClick() {
    emit('click');
}

const { settings } = useMapContext();

const background = computed(() => {
    if (props.active) return 'rgba(16, 185, 129, 0.5)';

    return settings.value.theme === 'dark' ? '#111' : '#fff';
});
</script>
