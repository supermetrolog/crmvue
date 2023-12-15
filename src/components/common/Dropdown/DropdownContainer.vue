<template>
    <div class="DropdownContainer" :class="{ open: modelValue }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'DropdownContainer',
    emits: ['update:modelValue'],
    props: {
        modelValue: Boolean
    },
    methods: {
        switchVisibility() {
            this.$emit('update:modelValue', !this.modelValue);
        }
    }
};
</script>