<template>
    <component
        :is="as ?? 'button'"
        ref="button"
        class="ui-button"
        :class="classes"
        :disabled="disabled || loading"
        :to
    >
        <slot name="before"></slot>
        <slot name="icon">
            <i v-if="icon" :class="[icon, iconClass]" />
        </slot>
        <span v-if="$slots.default">
            <slot></slot>
        </span>
        <Spinner v-if="loading" class="mini" />
        <slot name="after"></slot>
        <span
            v-if="badge"
            class="ui-button__badge"
            :class="[badgeClass, `ui-button__badge--${badgePosition ?? 'right'}`]"
        >
            {{ badge }}
        </span>
    </component>
</template>
<script setup lang="ts">
import type { Component } from 'vue';
import { computed, toRef, useTemplateRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import Spinner from '@/components/common/Spinner.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import { RouteLocationRaw } from 'vue-router';

export type ButtonAs = 'button' | 'a' | Component;

export type ButtonColor =
    | 'warning'
    | 'warning-light'
    | 'success'
    | 'success-light'
    | 'danger'
    | 'danger-light'
    | 'info'
    | 'dark'
    | 'light'
    | 'white'
    | 'transparent'
    | 'gray-light';

export type ButtonBadgePosition = 'left' | 'right';

export interface ButtonProps {
    as?: ButtonAs;
    to?: RouteLocationRaw;
    label?: string;
    icon?: string;
    iconClass?: string | string[] | object;
    color?: ButtonColor;
    loading?: boolean;
    active?: boolean;
    small?: boolean;
    rounded?: boolean;
    outlined?: boolean;
    bolder?: boolean;
    shadow?: boolean;
    uppercase?: boolean;
    rect?: boolean;
    disabled?: boolean;
    big?: boolean;
    center?: boolean;
    tooltip?: string;
    mini?: boolean;
    badge?: number;
    badgeClass?: string | string[] | object;
    badgePosition?: ButtonBadgePosition;
}

const props = defineProps<ButtonProps>();

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
