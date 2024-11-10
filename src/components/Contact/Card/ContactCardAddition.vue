<template>
    <Tippy theme="bordered">
        <template #default>
            <slot name="icon">
                <i :class="icon"></i>
            </slot>
        </template>
        <template #content>
            <slot>
                <i :class="icon" class="mr-2"></i>
                <slot name="label">
                    <span>
                        {{ label }}
                    </span>
                </slot>
            </slot>
        </template>
    </Tippy>
</template>
<script setup>
import { Tippy } from 'vue-tippy';

defineProps({
    icon: {
        type: String,
        default: 'fa-solid fa-info'
    },
    label: {
        type: String,
        default: null
    }
});
</script>
