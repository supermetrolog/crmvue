<template>
    <div class="settings-form-element position-relative br-1" :class="{ deleted: isDeleted }">
        <div class="settings-form-element__header px-2 py-1">
            <span class="text-grey font-weight-bold">
                <span>#{{ element.id }}, </span>
                <span v-tippy="'Дата создания'">{{ createdAt }}</span>
                <span
                    v-if="
                        element.created_at !== element.updated_at &&
                        element.updated_at !== element.created_at
                    "
                    v-tippy="'Дата обновления'"
                    class="ml-2 text-primary"
                >
                    <i class="fa-solid fa-sync" />
                    {{ updatedAt }}
                </span>
                <span v-if="isDeleted" v-tippy="'Дата удаления'" class="ml-2 text-danger">
                    <i class="fa-solid fa-ban" />
                    {{ deletedAt }}
                </span>
            </span>
            <div v-if="canEdit" class="settings-form-element__actions ml-auto">
                <UiButtonIcon
                    @click="$emit('edit')"
                    label="Редактировать"
                    icon="fa-solid fa-pen"
                    small
                    class="dashboard-bg-gray-l"
                />
                <UiButtonIcon
                    v-if="!isDeleted"
                    @click="$emit('delete')"
                    label="Удалить"
                    icon="fa-solid fa-close"
                    small
                    class="dashboard-bg-gray-l"
                />
            </div>
        </div>
        <div class="p-2">
            <slot />
        </div>
    </div>
</template>
<script setup>
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.js';

defineEmits(['edit', 'delete']);
const props = defineProps({
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

const createdAt = computed(() => toDateFormat(props.element.created_at, 'D.MM.YY'));
const updatedAt = computed(() => toDateFormat(props.element.updated_at, 'D.MM.YY'));
const deletedAt = computed(() => toDateFormat(props.element.deleted_at, 'D.MM.YY'));
</script>
