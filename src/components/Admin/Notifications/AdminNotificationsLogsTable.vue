<template>
    <ElTable :data="logs" border>
        <ElTableColumn prop="id" label="ID" />
        <ElTableColumn prop="action.id" label="Action ID" />
        <ElTableColumn prop="action.type" label="Action Type" />
        <ElTableColumn prop="action.label" label="Action Label" />
        <ElTableColumn prop="user_notification_id" label="User Notification ID" />
        <ElTableColumn v-slot="{ row }" label="Executed By">
            <Avatar
                :src="row.user.userProfile.avatar"
                :label="row.user.userProfile.medium_name"
                :size="40"
            />
        </ElTableColumn>
        <ElTableColumn prop="executed_at" label="Executed At" />
        <template #append>
            <Loader v-if="loading" />
        </template>
    </ElTable>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import Avatar from '@/components/common/Avatar.vue';
import Loader from '@/components/common/Loader.vue';
import { SearchedUserNotificationActionLog } from '@/types/user-notification/user-notification-action';

defineProps<{ logs: SearchedUserNotificationActionLog[]; loading?: boolean }>();
</script>
