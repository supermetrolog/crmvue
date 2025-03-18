<template>
    <div class="ui-field" :class="classes">
        <slot />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const props = defineProps({
    color: String,
    bordered: Boolean,
    small: Boolean
});

const classes = computed(() => {
    return {
        'ui-field--small': props.small,
        'ui-field--bordered': props.bordered,
        [`ui-field--cl-${props.color}`]: isNotNullish(props.color)
    };
});
</script>
