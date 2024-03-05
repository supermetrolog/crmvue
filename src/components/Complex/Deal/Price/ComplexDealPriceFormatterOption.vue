<template>
    <button
        @click.prevent="$emit('change')"
        class="complex-deal-price-formatter__option"
        :class="{ active: active }"
    >
        <slot></slot>
    </button>
</template>
<script>
export default {
    name: 'ComplexDealPriceFormatterOption',
    emits: ['change'],
    props: {
        active: {
            type: Boolean,
            default: false
        }
    }
};
</script>
