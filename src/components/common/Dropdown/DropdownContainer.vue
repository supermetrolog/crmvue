<template>
    <div class="DropdownContainer" :class="{ open: modelValue }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "DropdownContainer",
    props: {
        modelValue: Boolean,
    },
    emits: ["update:modelValue"],
    methods: {
        switchVisibility() {
            this.$emit("update:modelValue", !this.modelValue);
        },
    },
};
</script>

