<template>
    <VDropdown ref="dropdownEl">
        <template #trigger>
            <slot name="trigger">
                <UiButtonIcon :label :disabled :icon :small :color :class="buttonClass" />
            </slot>
        </template>
        <DropdownContent class="ui-dropdown-actions" :class="menuClass" :z-index="4001">
            <div class="ui-dropdown-actions__menu">
                <slot name="menu" />
                <div v-if="$slots.footer" class="ui-dropdown-actions__footer">
                    <slot name="footer" />
                </div>
            </div>
        </DropdownContent>
    </VDropdown>
</template>
<script setup>
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import { provide, useTemplateRef } from 'vue';
import { DropdownContent } from 'v-dropdown';

defineProps({
    disabled: Boolean,
    small: Boolean,
    menuClass: String,
    label: String,
    icon: {
        type: String,
        default: 'fa-solid fa-ellipsis'
    },
    color: String,
    buttonClass: [String, Object, Array]
});

const dropdownEl = useTemplateRef('dropdownEl');

function close() {
    dropdownEl.value.close();
}

provide('close-dropdown', close);
</script>
