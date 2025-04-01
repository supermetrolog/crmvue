<template>
    <table class="table" :class="{ 'table--fluid': fluid, 'table--shadow': shadow }">
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
    fluid: Boolean,
    shadow: Boolean
});
</script>
