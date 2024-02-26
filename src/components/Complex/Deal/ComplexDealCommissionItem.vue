<template>
    <li class="deal-info-commission__item" :class="{ cancel: cancel }">
        <i v-if="cancel" class="fa-solid fa-xmark"></i>
        <i v-else class="fa-solid fa-check"></i>
        <span class="deal-info-commission__label">{{ cancel ? cancelLabel : label }}</span>
        <span v-if="!cancel" class="deal-info-commission__value">
            <slot />
        </span>
    </li>
</template>
<script>
export default {
    name: 'ComplexDealCommissionItem',
    props: {
        label: {
            type: String,
            default: null
        },
        cancel: {
            type: Boolean,
            default: false
        },
        cancelLabel: {
            type: String,
            default: null
        }
    }
};
</script>
