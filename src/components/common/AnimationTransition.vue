<template>
    <transition
        mode="out-in"
        :enter-active-class="enterActiveClass"
        :leave-active-class="leaveActiveClass"
    >
        <slot />
    </transition>
</template>
<script>
export default {
    name: 'AnimationTransition',
    props: {
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
    },
    computed: {
        enterActiveClass() {
            return 'animate__animated animate__' + this.animation.enter;
        },
        leaveActiveClass() {
            return 'animate__animated animate__' + this.animation.leave;
        },
        duration() {
            return this.speed + 's';
        }
    }
};
</script>
<style scoped>
.animate__animated {
    --animate-duration: v-bind(duration);
}
</style>
