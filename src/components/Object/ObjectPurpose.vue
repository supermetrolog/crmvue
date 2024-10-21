<template>
    <tippy
        :hide-on-click="false"
        tag="strong"
        class="object-purposes__item"
        :class="{ active: purpose.included, disabled: disabled }"
    >
        <template #default>
            <i :class="purpose.icon" />
        </template>
        <template #content>
            <slot name="tippy">
                {{ purpose.name }}
            </slot>
        </template>
    </tippy>
</template>
<script setup>
import { Tippy } from 'vue-tippy';

defineProps({
    purpose: {
        type: Object,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
</script>
