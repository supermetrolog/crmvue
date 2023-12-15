<template>
    <button @click="switchDropdown" class="DropdownSwitcher">
        <i v-if="!modelValue" class="fa fa-chevron-down"></i>
        <i v-if="modelValue" class="fa fa-chevron-up"></i>
        <template v-if="title">
            <span>{{ title }}</span>
            <span
v-if="mainNumber || sideNumber"
                >({{ mainNumber }}<span v-if="sideNumber" class="side_number">{{ `/${sideNumber}` }}</span
                >)</span
            >
        </template>
    </button>
</template>

<script>
export default {
    name: 'Dropdown',
    emits: ['update:modelValue'],
    props: {
        title: {
            type: String,
            default: null
        },
        mainNumber: {
            type: Number,
            default: null
        },
        sideNumber: {
            type: Number,
            default: null
        },
        modelValue: Boolean
    },
    methods: {
        switchDropdown() {
            this.$emit('update:modelValue', !this.modelValue);
        }
    }
};
</script>