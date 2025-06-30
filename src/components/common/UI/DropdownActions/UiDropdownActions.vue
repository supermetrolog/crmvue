<template>
    <VDropdown ref="dropdownEl">
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
        <DropdownContent class="ui-dropdown-actions" :class="menuClass" :z-index="4001">
            <div class="ui-dropdown-actions__menu">
                <p
                    v-if="title || $slots.title"
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
<script setup>
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import { DropdownContent } from 'v-dropdown';
import { useTemplateRef } from 'vue';

defineProps({
    disabled: Boolean,
    small: Boolean,
    menuClass: String,
    label: String,
    title: String,
    icon: {
        type: String,
        default: 'fa-solid fa-ellipsis'
    },
    color: String,
    buttonClass: [String, Object, Array],
    titleClass: [String, Object, Array]
});

const dropdownEl = useTemplateRef('dropdownEl');

function open() {
    dropdownEl.value?.open();
}

defineExpose({ open });
</script>
