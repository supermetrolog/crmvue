<template>
    <ElTable :data="links" border>
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
        <ElTableColumn prop="whatsapp_profile_id" label="Whatsapp Profile ID" />
        <ElTableColumn prop="phone" label="Phone" />
        <ElTableColumn prop="first_name" label="First Name" />
        <ElTableColumn prop="full_name" label="Full Name" />
        <ElTableColumn prop="push_name" label="Push Name" />
        <ElTableColumn prop="revoked_at" label="Revoked At" />
        <ElTableColumn prop="created_at" label="Created At" />
        <ElTableColumn v-slot="{ row }" label="Actions">
            <UiButton
                @click="$emit('revoke', row.id)"
                :disabled="!!row.revoked_at"
                small
                color="danger-light"
            >
                Отозвать
            </UiButton>
        </ElTableColumn>
        <template #append>
            <Loader v-if="loading" />
        </template>
    </ElTable>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import Avatar from '@/components/common/Avatar.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import Loader from '@/components/common/Loader.vue';
import { UserWhatsappLink } from '@/types/integration/user-whatsapp-link';

defineEmits<{ (e: 'revoke', linkId: number): void }>();

defineProps<{ links: UserWhatsappLink[]; loading?: boolean }>();
</script>
