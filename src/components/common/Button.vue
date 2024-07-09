<template>
    <button
        @click.prevent="$emit('click')"
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
<script setup>
import { computed } from 'vue';

defineEmits(['click']);
const props = defineProps({
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
});

const hasBadge = computed(() => props.badge !== false);
const classButton = computed(() => ({
    'button--icon': props.icon,
    'button--warning': props.warning,
    'button--small': props.small,
    'button--success': props.success,
    'button--info': props.info,
    'button--danger': props.danger,
    'button--disabled': !props.active,
    'button--solid': props.solid
}));
</script>
