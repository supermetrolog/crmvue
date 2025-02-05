<template>
    <div class="settings-form-row-element">
        <DashboardChip
            :class="{
                'dashboard-bg-danger-l': isDeleted,
                'dashboard-bg-gray-l': !isDeleted
            }"
        >
            <slot name="text" :item="element" />
            <template v-if="canEdit">
                <span v-tippy="'Редактировать'" @click="$emit('edit')" class="c-pointer ml-1">
                    <i class="fa-solid fa-pen" />
                </span>
                <span
                    v-if="!isDeleted"
                    v-tippy="'Удалить'"
                    @click="$emit('delete')"
                    class="c-pointer ml-1"
                >
                    <i class="fa-solid fa-close" />
                </span>
            </template>
        </DashboardChip>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineEmits(['edit', 'delete']);
defineProps({
    isDeleted: {
        type: Boolean,
        default: false
    },
    element: {
        type: Object,
        required: true
    },
    canEdit: {
        type: Boolean,
        default: false
    }
});
</script>
