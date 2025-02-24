<template>
    <VDropdown ref="dropdownEl" :custom-container-class="customContainerClass">
        <template #trigger>
            <slot name="trigger">
                <UiButtonIcon label="Действия над задачей" :disabled icon="fa-solid fa-pen" />
            </slot>
        </template>
        <div class="ui-dropdown-actions__menu">
            <slot name="menu" />
        </div>
    </VDropdown>
</template>
<script setup>
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import { computed, provide, useTemplateRef } from 'vue';

const props = defineProps({
    disabled: Boolean,
    menuClass: String
});

const dropdownEl = useTemplateRef('dropdownEl');

function close() {
    dropdownEl.value.close();
}

provide('close-dropdown', close);

const customContainerClass = computed(() => {
    if (props.menuClass) return ['ui-dropdown-actions', props.menuClass].join(' ');
    return 'ui-dropdown-actions';
});
</script>
