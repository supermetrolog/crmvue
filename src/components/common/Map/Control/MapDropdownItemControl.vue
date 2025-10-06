<template>
    <div class="map-dropdown__item">
        <button
            @click="handle"
            :disabled="disabled || loading"
            class="map-dropdown__button"
            :class="[buttonClass, { active: active }]"
        >
            <slot :loading="loading">
                <slot name="icon">
                    <i v-if="icon" :class="icon" />
                </slot>
                <span>
                    <slot name="label">
                        {{ label }}
                    </slot>
                </span>
                <slot name="after"></slot>
                <Spinner v-if="loading" class="mini ml-auto" />
            </slot>
        </button>
    </div>
</template>
<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue';
import { ComponentClassAttribute } from '@/types/base';
import { useDropdown } from 'v-dropdown';

const emit = defineEmits<{ (e: 'handle'): void }>();

export type UiDropdownActionsButtonProps = {
    disabled?: boolean;
    active?: boolean;
    icon?: string;
    label?: string;
    buttonClass?: ComponentClassAttribute;
    closeOnClick?: boolean;
    loading?: boolean;
};

const props = withDefaults(defineProps<UiDropdownActionsButtonProps>(), {
    closeOnClick: true
});

function handle() {
    if (props.closeOnClick) {
        close();
    }

    emit('handle');
}

const { close } = useDropdown();
</script>
