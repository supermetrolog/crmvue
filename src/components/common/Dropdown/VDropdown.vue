<template>
    <ExtDropdown ref="dropdownEl" @visible-change="visibleHandler">
        <template #trigger>
            <slot name="trigger" />
        </template>
        <slot />
    </ExtDropdown>
</template>
<script setup>
import ExtDropdown from 'v-dropdown';
import { useTemplateRef } from 'vue';

const dropdownEl = useTemplateRef('dropdownEl');

function close() {
    dropdownEl.value.close();
}

function eventListener(event) {
    event.stopPropagation();
    if (event.code === 'Escape') close();
}

function visibleHandler(visible) {
    if (visible) document.addEventListener('keydown', eventListener, true);
    else document.removeEventListener('keydown', eventListener, true);
}

defineExpose({ close });
</script>
