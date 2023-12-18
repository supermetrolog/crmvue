<template>
    <transition mode="out-in" :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass">
        <slot />
    </transition>
</template>
<script>
export default {
    name: 'AnimationTransition',
    props: {
        animation: {
            type: String,
            default: 'fade'
        },
        fast: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        enterActiveClass() {
            return 'animate__animated animate__fadeIn' + (this.fast ? ' animate--fast' : '');
        },
        leaveActiveClass() {
            return 'animate__animated animate__fadeOut' + (this.fast ? ' animate--fast' : '');
        }
    }
};
</script>