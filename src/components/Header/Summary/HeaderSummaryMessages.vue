<template>
    <HeaderSummarySection
        :modal-title="`Просмотр новых сообщений (${count})`"
        :count
        label="Новые сообщения"
    >
        <template #modal>
            <InProgress />
        </template>
    </HeaderSummarySection>
</template>
<script setup>
import { ref } from 'vue';
import HeaderSummarySection from '@/components/Header/Summary/HeaderSummarySection.vue';
import InProgress from '@/components/common/InProgress.vue';

const count = ref(0);
</script>
