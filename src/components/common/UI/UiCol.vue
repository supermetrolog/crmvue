<template>
    <component :is="as" :class="classes">
        <slot />
    </component>
</template>
<script setup>
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const props = defineProps({
    cols: {
        type: [String, Number],
        default: null
    },
    xxl: {
        type: [String, Number],
        default: null
    },
    xl: {
        type: [String, Number],
        default: null
    },
    lg: {
        type: [String, Number],
        default: null
    },
    md: {
        type: [String, Number],
        default: null
    },
    sm: {
        type: [String, Number],
        default: null
    },
    as: {
        type: String,
        default: 'div'
    }
});

const breakpoints = ['xxl', 'xl', 'lg', 'md', 'sm'];

const classes = computed(() => {
    const list = [];

    if (props.cols) list.push(`col-${props.cols}`);

    list.push(
        ...breakpoints.reduce((acc, breakpoint) => {
            if (isNotNullish(props[breakpoint])) acc.push(`col-${breakpoint}-${props[breakpoint]}`);
            return acc;
        }, [])
    );

    return list;
});
</script>
