<template>
    <table class="table" :class="{ 'table--fluid': fluid }">
        <thead>
            <slot name="thead" />
        </thead>
        <tbody>
            <slot name="tbody" />
        </tbody>
    </table>
</template>

<script setup>
defineProps({
    fluid: {
        type: Boolean,
        default: false
    }
});
</script>
