<template>
    <div @click="$emit('select')" class="dashboard-card-link" :class="{ active: active }">
        <DashboardRoundedIcon v-if="icon" :icon="icon.name" :class="icon.class" />
        <p class="dashboard-card-link__value">
            <slot></slot>
        </p>
        <span v-if="badge !== null" class="dashboard-card-link__badge">
            {{ badge }}
        </span>
        <Checkbox @change="$emit('select')" :disabled="disabled" :checked="active" />
    </div>
</template>

<script setup>
import DashboardRoundedIcon from '@/components/Dashboard/DashboardRoundedIcon.vue';
import Checkbox from '@/components/common/Forms/Checkbox.vue';

defineEmits(['select']);
defineProps({
    icon: {
        type: Object,
        default: null
    },
    badge: {
        type: [Number, String],
        default: null
    },
    active: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
</script>
