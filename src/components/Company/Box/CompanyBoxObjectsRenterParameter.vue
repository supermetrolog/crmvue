<template>
    <li class="company-box-objects-renter-parameter">
        <span class="company-box-objects-renter-parameter__label">{{ label }}:</span>
        <span class="company-box-objects-renter-parameter__value">
            <slot>Нет данных</slot>
        </span>
    </li>
</template>

<script setup>
defineProps({ label: { type: String, required: true } });
</script>
