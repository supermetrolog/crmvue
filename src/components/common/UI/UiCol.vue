<template>
    <component :is="as" :class="classes">
        <slot />
    </component>
</template>
<script setup>
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const props = defineProps({
    cols: [String, Number],
    xxl: [String, Number],
    xl: [String, Number],
    lg: [String, Number],
    md: [String, Number],
    sm: [String, Number],
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
