<template>
    <ElTable :data="templates" border>
        <ElTableColumn prop="id" label="ID" />
        <ElTableColumn prop="kind" label="Kind" />
        <ElTableColumn prop="priority" label="Priority" />
        <ElTableColumn prop="category" label="Category" />
        <ElTableColumn prop="is_active" label="Is Active" />
        <ElTableColumn prop="created_at" label="Created At" />
        <ElTableColumn v-slot="{ row }" label="Actions">
            <div class="d-flex gap-1 flex-wrap">
                <UiButton @click="$emit('edit', row.id)" small color="light" icon="fa-solid fa-pen">
                    Редактировать
                </UiButton>
                <UiButton
                    v-if="row.is_active"
                    @click="$emit('disable', row.id)"
                    small
                    color="danger-light"
                    icon="fa-solid fa-ban"
                >
                    Отключить
                </UiButton>
                <UiButton
                    v-else
                    @click="$emit('enable', row.id)"
                    small
                    color="success-light"
                    icon="fa-solid fa-check"
                >
                    Включить
                </UiButton>
            </div>
        </ElTableColumn>
        <template #append>
            <Loader v-if="loading" />
        </template>
    </ElTable>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import Loader from '@/components/common/Loader.vue';
import { UserNotificationTemplate } from '@/types/user-notification/user-notification-template';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits<{
    (e: 'edit', templateId: number): void;
    (e: 'enable', templateId: number): void;
    (e: 'disable', templateId: number): void;
}>();

defineProps<{ templates: UserNotificationTemplate[]; loading?: boolean }>();
</script>
