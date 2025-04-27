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
import { inject } from 'vue';
import Spinner from '@/components/common/Spinner.vue';

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
        closeDropdown();
    }

    emit('handle');
}

const closeDropdown = inject('close-dropdown');
</script>
