<template>
    <div class="company-item-request-parameter">
        <p class="company-item-request-parameter__name">
            <span>{{ label }}</span>
            <span v-if="$slots['unit-type']" class="company-item-request-parameter__unit-type">
                <slot name="unit-type" />
            </span>
        </p>
        <slot name="extended">
            <span class="company-item-request-parameter__value">
                <slot>Нет данных</slot>
            </span>
        </slot>
    </div>
</template>

<script setup>
defineProps({ label: { type: String, required: true } });
</script>
