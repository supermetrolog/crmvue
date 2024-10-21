<template>
    <div class="messenger-dialog-preview-tab">
        <div class="messenger-dialog-preview-tab__header">
            <slot name="header">
                <div
                    class="messenger-dialog-preview-tab__heading"
                    :class="{ 'has-warning': hasWarning }"
                >
                    <slot name="icon">
                        <i class="fa-solid fa-arrow-right"></i>
                    </slot>
                    <slot name="title">
                        <p class="messenger-dialog-preview-tab__title">
                            {{ title }}
                        </p>
                    </slot>
                </div>
            </slot>
        </div>
        <div class="messenger-dialog-preview-tab__body">
            <slot />
        </div>
    </div>
</template>
<script setup>
defineProps({
    title: {
        type: String,
        default: null
    },
    hasWarning: {
        type: Boolean,
        default: false
    }
});
</script>
