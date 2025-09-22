<template>
    <ElTable :data="tickets" border>
        <ElTableColumn prop="id" label="ID" />
        <ElTableColumn v-slot="{ row }" label="User">
            <Avatar
                v-if="row.user"
                :src="row.user.userProfile.avatar"
                :label="row.user.userProfile.medium_name"
                :size="40"
            />
            <span v-else class="op-5">-</span>
        </ElTableColumn>
        <ElTableColumn prop="consumed_at" label="Consumed At" />
        <ElTableColumn prop="expires_at" label="Expires At" />
        <ElTableColumn prop="created_at" label="Created At" />
        <template #append>
            <Loader v-if="loading" />
        </template>
    </ElTable>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import Avatar from '@/components/common/Avatar.vue';
import Loader from '@/components/common/Loader.vue';
import { SearchedUserTelegramLinkTicket } from '@/api/user-telegram';

defineProps<{ tickets: SearchedUserTelegramLinkTicket[]; loading?: boolean }>();
</script>
