<template>
    <component
        :is="as ?? 'button'"
        ref="button"
        class="ui-button"
        :class="classes"
        :disabled="disabled || localeLoading"
        :to
        :href
        :target
    >
        <slot name="before"></slot>
        <slot name="icon">
            <i v-if="icon" :class="[icon, iconClass]" />
        </slot>
        <span v-if="$slots.default || label">
            <slot>
                {{ label }}
            </slot>
        </span>
        <slot v-if="hasLoadingState || localeLoading" name="loading">
            <Transition :duration="500" name="spinner-fade">
                <Spinner v-if="loading || state === 'loading'" class="mini ui-button__loader" />
                <i v-else class="fa-solid ui-button__loader ui-button__check" :class="stateIcon" />
            </Transition>
        </slot>
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
import { computed, ref, toRef, useTemplateRef, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import Spinner from '@/components/common/Spinner.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import { RouteLocationRaw } from 'vue-router';
import { useTimeoutFn } from '@vueuse/core';

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

export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

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
    state?: ButtonState;
    href?: string;
    target?: '_blank' | '_self' | '_parent';
}

const props = withDefaults(defineProps<ButtonProps>(), {
    state: 'idle'
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
        'ui-button--disabled': props.disabled,
        [`ui-button--cl-${props.color}`]: isNotNullish(props.color)
    };
});

if (props.tooltip) {
    useTippyText(useTemplateRef('button'), toRef(props, 'tooltip'));
}

const localeLoading = ref(props.loading || props.state === 'loading');

const hasLoadingState = computed(() => props.state !== 'idle');

const stateIcon = computed(() =>
    props.state === 'success'
        ? 'fa-check color-success'
        : props.state === 'error'
          ? 'fa-xmark color-danger'
          : undefined
);

const { start: stopLoading, stop: clearLoadingTimeout } = useTimeoutFn(
    () => {
        localeLoading.value = false;
    },
    1000,
    { immediate: false }
);

watch(
    () => props.state,
    value => {
        if (value === 'loading') {
            localeLoading.value = true;
            clearLoadingTimeout();
        } else {
            stopLoading();
        }
    }
);

watch(
    () => props.loading,
    value => {
        if (value) {
            localeLoading.value = true;
            clearLoadingTimeout();
        } else {
            stopLoading();
        }
    }
);
</script>
