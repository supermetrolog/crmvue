<template>
    <button ref="button" class="ui-button-icon" :class="classes" :disabled="disabled || loading">
        <slot>
            <Spinner v-if="loading" :size="20" class="mini" />
            <i v-else :class="icon" />
        </slot>
        <span
            v-if="badge"
            class="ui-button-icon__badge"
            :class="`ui-button-icon__badge--cl-${badgeColor}`"
        >
            {{ badge }}
        </span>
    </button>
</template>
<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import Spinner from '@/components/common/Spinner.vue';
import { useTippy } from 'vue-tippy';

export type ButtonIconColor =
    | 'warning'
    | 'warning-light'
    | 'success'
    | 'success-light'
    | 'danger'
    | 'danger-l'
    | 'info'
    | 'dark'
    | 'light'
    | 'white'
    | 'gray-l';

export interface ButtonIconProps {
    label?: string;
    icon?: string;
    color?: ButtonIconColor;
    active?: boolean;
    small?: boolean;
    mini?: boolean;
    disabled?: boolean;
    loading?: boolean;
    transparent?: boolean;
    rect?: boolean;
    badge?: number | string;
    badgeColor?: string;
}

const props = defineProps<ButtonIconProps>();

const classes = computed(() => {
    return {
        active: props.active,
        small: props.small,
        mini: props.mini,
        rect: props.rect,
        transparent: props.transparent,
        [`ui-button-icon--cl-${props.color}`]: isNotNullish(props.color)
    };
});

if (props.label) {
    useTippy(useTemplateRef('button'), { content: toRef(() => props.label) });
}
</script>
