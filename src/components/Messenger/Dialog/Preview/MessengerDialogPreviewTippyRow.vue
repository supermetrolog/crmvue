<template>
    <p>
        <span class="messenger-dialog-preview-tippy__label">{{ label }}: </span>
        <slot>
            <span class="messenger-warning">не указано</span>
        </slot>
    </p>
</template>
<script setup>
defineProps({
    label: {
        type: String,
        required: true
    }
});
</script>
