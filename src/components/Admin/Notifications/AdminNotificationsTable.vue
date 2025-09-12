<template>
    <ElTable :data="notifications" border>
        <ElTableColumn prop="id" label="ID" />
        <ElTableColumn prop="subject" label="Subject" />
        <ElTableColumn prop="user_id" label="User ID" />
        <ElTableColumn v-slot="{ row }" label="Created By">
            <Avatar
                v-if="row.createdBy"
                :src="row.createdBy.userProfile.avatar"
                :label="row.createdBy.userProfile.medium_name"
                :size="40"
            />
            <span v-else class="op-5">System</span>
        </ElTableColumn>
        <ElTableColumn prop="template_id" label="Template ID" />
        <ElTableColumn prop="viewed_at" label="Viewed At" />
        <ElTableColumn prop="acted_at" label="Acted At" />
        <ElTableColumn prop="created_at" label="Created At" />
        <ElTableColumn v-slot="{ row }" label="Actions">
            <UiButton @click="$emit('open', row.id)" small color="light">Открыть</UiButton>
        </ElTableColumn>
        <template #append>
            <Loader v-if="loading" />
        </template>
    </ElTable>
</template>

<script setup lang="ts">
import { ShortUserNotification } from '@/types/user-notification/user-notification';
import { ElTable, ElTableColumn } from 'element-plus';
import Avatar from '@/components/common/Avatar.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import Loader from '@/components/common/Loader.vue';

defineEmits<{ (e: 'open', notificationId: number): void }>();

defineProps<{ notifications: ShortUserNotification[]; loading?: boolean }>();
</script>
