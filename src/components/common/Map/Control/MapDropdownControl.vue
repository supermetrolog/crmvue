<template>
    <VDropdown
        ref="dropdownEl"
        @visible-change="$emit('visible-change', $event)"
        :align
        :disabled
        :gap="13"
    >
        <template #trigger>
            <slot name="trigger"></slot>
        </template>
        <DropdownContent class="map-dropdown" :class="{ dark: theme === 'dark' }" :z-index="4001">
            <div class="map-dropdown__menu">
                <slot name="menu" />
            </div>
        </DropdownContent>
    </VDropdown>
</template>
<script setup lang="ts">
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import { DropdownContent } from 'v-dropdown';
import { computed, useTemplateRef } from 'vue';

defineEmits<{ (e: 'visible-change', visible: boolean): void }>();

withDefaults(
    defineProps<{
        disabled?: boolean;
        align?: 'left' | 'center' | 'right';
        theme?: 'light' | 'dark';
    }>(),
    { theme: 'dark' }
);

const dropdownEl = useTemplateRef('dropdownEl');

function open() {
    dropdownEl.value?.open();
}

function toggleVisible() {
    dropdownEl.value?.toggleVisible();
}

const isVisible = computed(() => (dropdownEl.value?.visible as boolean) ?? false);

defineExpose({ open, toggleVisible, visible: isVisible });
</script>
<style lang="scss">
.map-dropdown {
    --background: #fff;
    --color: #000;

    &.dark {
        --background: #111;
        --color: #ccc;
    }

    border: none !important;
    box-shadow:
        0 1px 5px #0003,
        0 2px 2px #00000024,
        0 3px 1px -2px #0000001f !important;

    &__menu {
        display: flex;
        flex-direction: column;
        align-items: start;
        background-color: var(--background);
        color: var(--color);
    }

    &__item {
        width: 100% !important;

        &:not(:last-child) {
            border-bottom: 1px solid #e5e7eb !important;
        }
    }

    &__button {
        display: block;
        padding: 8px;
        color: inherit;
        background-color: var(--background);
        border: none;
        font-size: 16px;
        transition:
            background-color 0.4s ease,
            color 0.4s ease;

        &:has(i),
        &:has(.spinner) {
            display: flex;
            align-items: center;
            gap: 7px;

            i {
                width: 20px;
            }
        }

        &:not(:disabled) {
            cursor: pointer;
        }

        &.active {
            background-color: rgba(16, 185, 129, 0.5);
        }
    }
}
</style>
