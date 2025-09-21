<template>
    <div>
        <div class="white-block mb-3">
            <PaginationClassic @next="setNextPage" :pagination="pagination" :loading="isLoading" />
        </div>
        <Spinner v-if="isLoading && !tickets.length" />
        <AdminIntegrationsTelegramLinkTicketsTable v-else :loading="isLoading" :tickets />
    </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import api from '@/api/api.js';
import AdminIntegrationsTelegramLinkTicketsTable from '@/components/Admin/Integrations/AdminIntegrationsTelegramLinkTicketsTable.vue';
import { useTableFetchedData } from '@/composables/useTableFetchedData';

const {
    data: tickets,
    isLoading,
    pagination,
    setNextPage
} = useTableFetchedData(api.userTelegram.admin.tickets);
</script>
