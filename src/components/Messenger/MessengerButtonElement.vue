<template>
    <div class="messenger-button__element" :class="className">
        <span v-if="label" class="messenger-button__chip">{{ label }}</span>
        <i :class="icon"></i>
    </div>
</template>
<script>
export default {
    name: 'MessengerButtonElement',
    props: {
        icon: {
            type: String,
            default: 'fa-solid fa-bolt'
        },
        label: {
            type: [String, Number],
            default: null
        },
        name: {
            type: String,
            default: null
        }
    },
    computed: {
        className() {
            if (this.name) return ['icon--' + this.name];
            return null;
        }
    }
};
</script>
