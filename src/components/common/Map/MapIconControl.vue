<template>
    <MapControl @click="$emit('click')" :active>
        <div class="d-flex align-items-center justify-content-center">
            <slot>
                <i v-if="icon" :class="icon" />
            </slot>
        </div>
    </MapControl>
</template>
<script setup lang="ts">
import MapControl from '@/components/common/Map/MapControl.vue';

defineEmits<{
    (e: 'click'): void;
}>();

defineProps<{
    icon?: string;
    active?: boolean;
}>();
</script>
