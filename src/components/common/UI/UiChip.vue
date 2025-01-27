<template>
    <div class="ui-chip" :class="{ [`ui-chip--${color}`]: !!color, [`ui-chip--${size}`]: !!size }">
        <slot />
    </div>
</template>
<script setup>
defineProps({
    color: String,
    size: String
});
</script>
