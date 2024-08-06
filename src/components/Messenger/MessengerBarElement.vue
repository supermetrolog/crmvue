<template>
    <div class="messenger-bar__element rounded-icon" :class="className">
        <span v-if="label" class="messenger-bar__chip">{{ label }}</span>
        <i :class="icon"></i>
    </div>
</template>
<script>
export default {
    name: 'MessengerBarElement',
    props: {
        icon: {
            type: String,
            default: 'fa-solid fa-bolt'
        },
        label: {
            type: [String, Number],
            default: null
        },
        color: {
            type: String,
            default: null
        }
    },
    computed: {
        className() {
            if (this.color) return ['bg-' + this.color];
            return null;
        }
    }
};
</script>
