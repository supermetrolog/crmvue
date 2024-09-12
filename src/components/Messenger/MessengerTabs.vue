<template>
    <div class="messenger-tabs">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="switchTab(tab.id)"
            class="messenger-tabs__tab"
            :class="[{ active: current === tab.id }, tab.class]"
        >
            <slot :name="tab.key" :tab="tab">{{ tab.label }}</slot>
        </button>
    </div>
</template>
<script setup>
const emit = defineEmits(['switch']);
defineProps({
    tabs: {
        type: Array,
        required: true
    },
    current: {
        type: Number,
        default: null
    }
});

const switchTab = tabId => {
    emit('switch', tabId);
};
</script>
