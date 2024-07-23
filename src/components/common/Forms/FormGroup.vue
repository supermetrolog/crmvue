<template>
    <div class="form__group row">
        <p v-if="subtitle" class="form__subtitle col-12 m-0 p-0">{{ subtitle }}</p>
        <slot />
    </div>
</template>

<script setup>
defineProps({
    subtitle: {
        type: String,
        default: undefined
    }
});
</script>
