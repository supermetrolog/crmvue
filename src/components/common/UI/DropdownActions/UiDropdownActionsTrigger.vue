<template>
    <button ref="trigger" :disabled class="ui-dropdown-actions__trigger" :class="classes">
        <slot>
            <slot name="icon">
                <i v-if="icon" :class="icon" />
            </slot>
        </slot>
    </button>
</template>
<script setup>
import { useTippy } from 'vue-tippy';
import { computed, toRef, useTemplateRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const props = defineProps({
    disabled: Boolean,
    icon: {
        type: String,
        default: 'fa-solid fa-ellipsis-h'
    },
    label: String,
    color: String
});

useTippy(useTemplateRef('trigger'), { content: toRef(props, 'label') });

const classes = computed(() => ({
    [`ui-dropdown-actions__trigger--cl-${props.color}`]: isNotNullish(props.color)
}));
</script>
