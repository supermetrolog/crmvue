<template>
    <div>
        <div class="white-block mb-3">
            <PaginationClassic @next="setNextPage" :pagination="pagination" :loading="isLoading" />
        </div>
        <Spinner v-if="isLoading && !links.length" />
        <AdminIntegrationsWhatsappLinksTable
            v-else
            @revoke="revokeLink"
            :loading="isLoading || isRevoking"
            :links
        />
    </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import { useTableFetchedData } from '@/composables/useTableFetchedData';
import api from '@/api/api';
import AdminIntegrationsWhatsappLinksTable from '@/components/Admin/Integrations/AdminIntegrationsWhatsappLinksTable.vue';
import { useAsync } from '@/composables/useAsync';
import dayjs from 'dayjs';
import { toServerDate } from '@/utils/formatters/date';

const {
    data: links,
    isLoading,
    pagination,
    setNextPage
} = useTableFetchedData(api.userWhatsapp.admin.list);

const { execute: revokeLink, isLoading: isRevoking } = useAsync(
    api.userWhatsapp.admin.revokeByLink,
    {
        confirmation: true,
        confirmationContent: {
            title: 'Отзыв Whatsapp',
            message: 'Вы уверены, что хотите отозвать Whatsapp пользователя?'
        },
        onFetchResponse({ args }) {
            const link = links.value.find(link => link.id === args[0]);

            if (link) {
                link.revoked_at = toServerDate(dayjs());
            }
        }
    }
);
</script>
