<template>
    <div @click="$emit('select')" class="dashboard-card-link" :class="{ active: active }">
        <DashboardRoundedIcon v-if="icon" :icon="icon.name" :class="icon.class" />
        <p class="dashboard-card-link__value">
            <slot></slot>
        </p>
        <span v-if="badge !== null" class="dashboard-card-link__badge">
            {{ badge }}
        </span>
        <UiCheckbox :disabled="disabled" :checked="active" />
    </div>
</template>

<script setup>
import DashboardRoundedIcon from '@/components/Dashboard/DashboardRoundedIcon.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';

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
