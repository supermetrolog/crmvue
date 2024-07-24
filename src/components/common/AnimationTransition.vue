<template>
    <transition
        mode="out-in"
        :enter-active-class="enterActiveClass"
        :leave-active-class="leaveActiveClass"
    >
        <slot />
    </transition>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    animation: {
        type: Object,
        default: () => ({
            enter: 'fadeIn',
            leave: 'fadeOut'
        })
    },
    speed: {
        type: Number,
        default: 1
    }
});

const enterActiveClass = computed(() => 'animate__animated animate__' + props.animation.enter);
const leaveActiveClass = computed(() => 'animate__animated animate__' + props.animation.leave);
const duration = computed(() => props.speed + 's');
</script>
<style scoped>
.animate__animated {
    --animate-duration: v-bind(duration);
}
</style>
