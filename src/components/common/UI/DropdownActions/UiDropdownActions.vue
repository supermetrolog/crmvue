<template>
    <VDropdown
        ref="dropdownEl"
        @visible-change="$emit('visible-change', $event)"
        :manual
        :align
        :disabled
    >
        <template #trigger>
            <slot name="trigger">
                <UiButtonIcon :label
:disabled
:icon
:small
:color
:class="buttonClass" />
            </slot>
        </template>
        <DropdownContent
            class="ui-dropdown-actions"
            :class="menuClass"
            :z-index="4001"
            :style="menuStyle"
        >
            <div class="ui-dropdown-actions__menu">
                <p
                    v-if="title || $slots?.title"
                    class="ui-dropdown-actions__title"
                    :class="titleClass"
                >
                    <slot name="title">{{ title }}</slot>
                </p>
                <slot name="menu" />
                <div v-if="$slots.footer" class="ui-dropdown-actions__footer w-100">
                    <slot name="footer" />
                </div>
            </div>
        </DropdownContent>
    </VDropdown>
</template>
<script setup lang="ts">
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import { DropdownContent } from 'v-dropdown';
import { computed, useTemplateRef } from 'vue';
import { ComponentClassAttribute } from '@/types/base';

defineEmits<{ (e: 'visible-change', visible: boolean) }>();

const { icon = 'fa-solid fa-ellipsis' } = defineProps<{
    disabled?: boolean;
    small?: boolean;
    menuClass?: string;
    label?: string;
    title?: string;
    icon?: string;
    color?: string;
    buttonClass?: ComponentClassAttribute;
    titleClass?: ComponentClassAttribute;
    menuStyle?: ComponentClassAttribute;
    manual?: boolean;
    align?: 'left' | 'center' | 'right';
}>();

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
