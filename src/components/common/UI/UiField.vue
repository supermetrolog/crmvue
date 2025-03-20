<template>
    <div ref="field" class="ui-field" :class="classes">
        <slot />
    </div>
</template>
<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useTippyText } from '@/composables/useTippyText.js';

const props = defineProps({
    color: String,
    bordered: Boolean,
    small: Boolean,
    tooltip: String
});

const classes = computed(() => {
    return {
        'ui-field--small': props.small,
        'ui-field--bordered': props.bordered,
        [`ui-field--cl-${props.color}`]: isNotNullish(props.color)
    };
});

if (props.tooltip) {
    useTippyText(useTemplateRef('field'), toRef(props, 'tooltip'));
}
</script>
