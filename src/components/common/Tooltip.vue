<template>
    <Tippy class="tooltip" :class="{ pre: preFormat }">
        <template #default>
            <slot name="trigger">
                <i :class="icon" />
            </slot>
        </template>
        <template #content>
            <slot name="content">
                <div class="tooltip__text">
                    {{ text }}
                </div>
            </slot>
        </template>
    </Tippy>
</template>
<script setup>
import { Tippy } from 'vue-tippy';

defineProps({
    text: {
        type: String,
        default: null
    },
    icon: {
        type: String,
        default: 'fa-solid fa-circle-info'
    },
    preFormat: {
        type: Boolean,
        default: false
    }
});
</script>
