<template>
    <button ref="button" class="ui-button" :class="classes" :disabled="disabled || loading">
        <slot name="before"></slot>
        <slot name="icon">
            <i v-if="icon" :class="[icon, iconClass]" />
        </slot>
        <span v-if="$slots.default">
            <slot></slot>
        </span>
        <Spinner v-if="loading" class="mini" />
        <slot name="after"></slot>
    </button>
</template>
<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import Spinner from '@/components/common/Spinner.vue';
import { useTippyText } from '@/composables/useTippyText.js';

const props = defineProps({
    label: String,
    icon: String,
    iconClass: {
        type: [Array, String, Object]
    },
    color: String,
    loading: Boolean,
    active: Boolean,
    small: Boolean,
    rounded: Boolean,
    outlined: Boolean,
    bolder: Boolean,
    shadow: Boolean,
    uppercase: Boolean,
    rect: Boolean,
    disabled: Boolean,
    big: Boolean,
    center: Boolean,
    tooltip: String,
    mini: Boolean
});

const classes = computed(() => {
    return {
        'ui-button--loading': props.loading,
        'ui-button--active': props.active,
        'ui-button--small': props.small,
        'ui-button--mini': props.mini,
        'ui-button--rounded': props.rounded,
        'ui-button--rect': props.rect,
        'ui-button--outlined': props.outlined,
        'ui-button--bolder': props.bolder,
        'ui-button--shadow': props.shadow,
        'ui-button--uppercase': props.uppercase,
        'ui-button--center': props.center,
        'ui-button--big': props.big,
        [`ui-button--cl-${props.color}`]: isNotNullish(props.color)
    };
});

if (props.tooltip) {
    useTippyText(useTemplateRef('button'), toRef(props, 'tooltip'));
}
</script>
