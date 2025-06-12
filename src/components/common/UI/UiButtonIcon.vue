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
<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import Spinner from '@/components/common/Spinner.vue';
import { useTippy } from 'vue-tippy';

const props = defineProps({
    label: String,
    active: Boolean,
    small: Boolean,
    mini: Boolean,
    icon: String,
    color: String,
    disabled: Boolean,
    loading: Boolean,
    rect: Boolean,
    badge: [Number, String],
    badgeColor: String
});

const classes = computed(() => {
    return {
        active: props.active,
        small: props.small,
        mini: props.mini,
        rect: props.rect,
        [`ui-button-icon--cl-${props.color}`]: isNotNullish(props.color)
    };
});

if (props.label) {
    useTippy(useTemplateRef('button'), { content: toRef(() => props.label) });
}
</script>
