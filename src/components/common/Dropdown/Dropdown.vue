<template>
    <button
        v-tippy="'Нажмите, чтобы открыть содержимое'"
        @click="modelValue = !modelValue"
        class="dropdown-switcher dashboard-chip"
    >
        <i v-if="modelValue" class="fa fa-chevron-up"></i>
        <i v-else class="fa fa-chevron-down"></i>
        <template v-if="title">
            <span>{{ title }}</span>
            <span v-if="mainNumber || sideNumber">
                <span>({{ mainNumber }}</span>
                <span v-if="sideNumber" class="dropdown-switcher__side">
                    {{ `/${sideNumber}` }}
                </span>
                <span>)</span>
            </span>
        </template>
    </button>
</template>

<script setup>
defineProps({
    title: { type: String, default: null },
    mainNumber: { type: Number, default: null },
    sideNumber: { type: Number, default: null }
});

const modelValue = defineModel({ type: Boolean });
</script>
