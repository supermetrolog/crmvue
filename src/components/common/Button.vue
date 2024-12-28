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
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { isString } from '@/utils/helpers/string/isString.js';
import { isNumber } from '@/utils/helpers/number/isNumber.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';

defineEmits(['click']);
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    icon: Boolean,
    warning: Boolean,
    small: Boolean,
    success: Boolean,
    info: Boolean,
    danger: Boolean,
    solid: Boolean,
    dark: Boolean,
    badge: [String, Number],
    active: {
        type: [Boolean, Number, String],
        default: true
    },
    disabled: {
        type: [Boolean, Number],
        default: false
    }
});

const hasBadge = computed(() => {
    if (isNullish(props.badge)) return false;
    if (isString(props.badge)) return isNotEmptyString(props.badge);
    if (isNumber(props.badge)) return props.badge > 0;
});

const classButton = computed(() => ({
    'button--icon': props.icon,
    'button--warning': props.warning,
    'button--small': props.small,
    'button--success': props.success,
    'button--info': props.info,
    'button--danger': props.danger,
    'button--disabled': !props.active,
    'button--solid': props.solid,
    'button--dark': props.dark
}));
</script>
