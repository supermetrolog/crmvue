<template>
    <button v-tippy="label" class="ui-button-icon" :class="{ active: active, small: small }">
        <slot>
            <i :class="icon" />
        </slot>
    </button>
</template>
<script setup>
defineProps({
    label: String,
    active: Boolean,
    small: Boolean,
    icon: String
});
</script>
