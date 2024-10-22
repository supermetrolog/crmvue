<template>
    <Transition name="yandex-map" appear>
        <div v-if="show" class="yandex-map-loader">
            <div class="yandex-map-loader__body">
                <Spinner class="mini" />
                <p>{{ label }}</p>
            </div>
        </div>
    </Transition>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';

defineProps({
    show: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: 'Обновление карты..'
    }
});
</script>
<style>
.yandex-map-enter-active,
.yandex-map-leave-active {
    transition: transform 1s ease;
}

.yandex-map-enter-from {
    transform: translateY(-150px);
}

.yandex-map-leave-to {
    transform: translateY(-150px);
}
</style>
