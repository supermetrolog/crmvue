<template>
    <button
        @click.prevent="clickHandler"
        class="button"
        :class="classButton"
        :title="title"
        :disabled="disabled"
    >
        <span v-if="hasBadge" class="button__badge badge badge-danger">
            {{ badge }}
        </span>
        <slot />
    </button>
</template>
<script>
export default {
    name: 'Button',
    emits: ['click'],
    props: {
        icon: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        warning: {
            type: Boolean,
            default: false
        },
        small: {
            type: Boolean,
            default: false
        },
        success: {
            type: Boolean,
            default: false
        },
        info: {
            type: Boolean,
            default: false
        },
        danger: {
            type: Boolean,
            default: false
        },
        badge: {
            type: [String, Number, Boolean],
            default: false
        },
        active: {
            type: [Boolean, Number, String],
            default: true
        },
        prevent: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: [Boolean, Number],
            default: false
        },
        solid: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        hasBadge() {
            return this.badge !== false;
        },
        classButton() {
            return {
                'button--icon': this.icon,
                'button--warning': this.warning,
                'button--small': this.small,
                'button--success': this.success,
                'button--info': this.info,
                'button--danger': this.danger,
                'button--disabled': !this.active,
                'button--solid': this.solid
            };
        }
    },
    methods: {
        clickHandler() {
            this.$emit('click');
        }
    }
};
</script>
