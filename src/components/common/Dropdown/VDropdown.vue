<template>
    <Dropdown ref="dropdownEl" @visible-change="visibleHandler">
        <template #trigger>
            <slot name="trigger" />
        </template>
        <slot />
    </Dropdown>
</template>
<script setup>
import { Dropdown } from 'v-dropdown';
import { ref, useTemplateRef } from 'vue';

const emit = defineEmits(['visible-change']);

const dropdownEl = useTemplateRef('dropdownEl');

function close() {
    dropdownEl.value.close();
}

function open() {
    dropdownEl.value?.display();
}

function toggleVisible() {
    dropdownEl.value?.toggleVisible();
}

function eventListener(event) {
    event.stopPropagation();
    if (event.code === 'Escape') close();
}

const isVisible = ref(false);

function visibleHandler(visible) {
    isVisible.value = visible;
    emit('visible-change', visible);

    if (visible) document.addEventListener('keydown', eventListener, true);
    else document.removeEventListener('keydown', eventListener, true);
}

defineExpose({ close, open, toggleVisible, visible: isVisible });
</script>
