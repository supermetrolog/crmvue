<template>
    <div class="ui-dropdown-actions__element">
        <button
            @click="handle"
            :disabled="disabled || loading"
            class="ui-dropdown-actions__button"
            :class="[buttonClass, { active: active }]"
        >
            <slot :loading="loading">
                <slot name="icon">
                    <i v-if="icon" :class="icon" />
                </slot>
                <span>{{ label }}</span>
                <slot name="after"></slot>
                <Spinner v-if="loading" class="mini ml-auto" />
            </slot>
        </button>
    </div>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import { useDropdown } from 'v-dropdown';

const emit = defineEmits(['handle']);
const props = defineProps({
    disabled: Boolean,
    active: Boolean,
    icon: String,
    label: String,
    buttonClass: String,
    closeOnClick: {
        type: Boolean,
        default: true
    },
    loading: Boolean
});

function handle() {
    if (props.closeOnClick) {
        close();
    }

    emit('handle');
}

const { close } = useDropdown();
</script>
