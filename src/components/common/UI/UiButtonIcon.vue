<template>
    <button ref="button" class="ui-button-icon" :class="classes" :disabled="disabled || loading">
        <slot>
            <Spinner v-if="loading" :size="20" class="mini" />
            <i v-else :class="icon" />
        </slot>
    </button>
</template>
<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import Spinner from '@/components/common/Spinner.vue';
import { useTippyText } from '@/composables/useTippyText.js';

const props = defineProps({
    label: String,
    active: Boolean,
    small: Boolean,
    icon: String,
    color: String,
    disabled: Boolean,
    loading: Boolean
});

const classes = computed(() => {
    return {
        active: props.active,
        small: props.small,
        [`ui-button-icon--cl-${props.color}`]: isNotNullish(props.color)
    };
});

if (props.label) {
    useTippyText(useTemplateRef('button', toRef(props, 'label')));
}
</script>
