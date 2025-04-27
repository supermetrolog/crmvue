<template>
    <div class="icon-picker">
        <span v-if="label" class="icon-picker__label">
            {{ label }}
        </span>
        <UiDropdownActions>
            <template #trigger>
                <UiButton
                    @click.prevent
                    small
                    color="light"
                    class="icon-picker__preview"
                    :tooltip
                    :style="buttonStyle"
                    :icon="modelValue"
                />
            </template>
            <template #menu>
                <div class="icon-picker__wrapper">
                    <p class="mb-2 text-grey">Выберите иконку</p>
                    <div class="icon-picker__list">
                        <UiButton
                            v-for="option in iconsOptions"
                            :key="option"
                            @click="selectIcon(option)"
                            :color="option === modelValue ? 'success-light' : 'light'"
                            small
                            class="icon-picker__element"
                        >
                            <i :class="option" />
                        </UiButton>
                    </div>
                </div>
            </template>
        </UiDropdownActions>
    </div>
</template>
<script setup>
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import UiButton from '@/components/common/UI/UiButton.vue';

const modelValue = defineModel({ type: String, default: 'fa-solid fa-folder' });
const props = defineProps({
    size: {
        type: Number,
        default: 40
    },
    label: String,
    icons: Array,
    extraIcons: {
        type: Array,
        default: () => []
    },
    color: String,
    tooltip: {
        type: String,
        default: 'Нажмите, чтобы выбрать иконку'
    }
});

const _icons = [
    'fa-solid fa-folder',
    'fa-solid fa-folder-open',
    'fa-solid fa-thumbs-up',
    'fa-solid fa-thumbs-down',
    'fa-solid fa-fire',
    'fa-solid fa-star',
    'fa-solid fa-heart',
    'fa-solid fa-phone',
    'fa-solid fa-phone-volume',
    'fa-solid fa-comment',
    'fa-solid fa-eye',
    'fa-solid fa-eye-slash',
    'fa-solid fa-user',
    'fa-solid fa-check',
    'fa-solid fa-envelope',
    'fa-solid fa-font-awesome',
    'fa-solid fa-location-dot',
    'fa-solid fa-poo',
    'fa-solid fa-calendar-days',
    'fa-solid fa-bolt',
    'fa-solid fa-car',
    'fa-solid fa-trash',
    'fa-solid fa-lock',
    'fa-solid fa-tag',
    'fa-solid fa-bookmark',
    'fa-solid fa-print',
    'fa-solid fa-key',
    'fa-solid fa-handshake',
    'fa-solid fa-clock',
    'fa-solid fa-pause'
];

const buttonStyle = computed(() => {
    return {
        width: props.size + 'px',
        height: props.size + 'px',
        color: props.color
    };
});

const iconsOptions = computed(() => {
    if (isNotNullish(props.icons) && props.icons.length > 0) return props.icons;
    return _icons;
});

function selectIcon(icon) {
    modelValue.value = icon;
}
</script>
