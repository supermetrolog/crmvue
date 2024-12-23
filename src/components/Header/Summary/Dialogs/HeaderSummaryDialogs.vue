<template>
    <div class="header-summary-dialogs">
        <div class="header-summary-dialogs__header">
            <p class="header-summary-dialogs__title">{{ title }}</p>
            <div v-if="$slots.actions" class="header-summary-dialogs__actions">
                <slot name="actions" />
            </div>
        </div>
        <slot />
    </div>
</template>
<script setup>
defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>
