<template>
    <UiDropdownActions
        ref="dropdownEl"
        @visible-change="handleVisibleChange"
        :title
        :menu-style
        :align
        manual
        menu-class="ui-dropdown-actions__nested"
        class="ui-dropdown-actions__element"
    >
        <template #trigger>
            <slot name="trigger">
                <UiDropdownActionsButton
                    v-bind="buttonProps"
                    ref="buttonEl"
                    @handle="toggleVisible"
                    :button-class="{ selected: isVisible }"
                >
                    <template #after>
                        <i class="fa-solid fa-caret-right ml-auto" />
                    </template>
                </UiDropdownActionsButton>
            </slot>
        </template>
        <template #menu>
            <slot name="menu" />
        </template>
        <template #footer>
            <slot name="footer" />
        </template>
    </UiDropdownActions>
</template>
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { ComponentClassAttribute } from '@/types/base';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import { useElementSize } from '@vueuse/core';
import { useDropdown } from 'v-dropdown';

type Props = {
    disabled?: boolean;
    active?: boolean;
    icon?: string;
    label?: string;
    buttonClass?: ComponentClassAttribute;
    loading?: boolean;
    title?: string;
    position?: 'left' | 'right';
    closeOnClick?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    position: 'right',
    closeOnClick: true
});

const buttonProps = computed(() => {
    return {
        disabled: props.disabled,
        active: props.active,
        icon: props.icon,
        label: props.label,
        buttonClass: props.buttonClass,
        loading: props.loading,
        closeOnClick: props.closeOnClick
    };
});

const buttonEl = useTemplateRef('buttonEl');

const { width, height } = useElementSize(buttonEl);

const menuStyle = computed(() => {
    return {
        'margin-left': `${props.position === 'left' ? -width.value - 5 : width.value + 5}px`,
        'margin-top': `-${height.value + 5}px`
    };
});

const dropdownEl = useTemplateRef('dropdownEl');

function toggleVisible() {
    if (!isVisible.value) dropdownEl.value?.toggleVisible();
}

const isVisible = computed(() => dropdownEl.value?.visible ?? false);

const align = computed(() => {
    return props.position === 'left' ? 'right' : 'left';
});

// dropdown

const { close: closeParent, visible: parentIsVisible } = useDropdown();

function handleVisibleChange(visible) {
    if (!visible && parentIsVisible.value) closeParent();
}
</script>
