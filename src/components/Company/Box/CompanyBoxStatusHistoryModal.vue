<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="800"
        :title="`История изменений статуса компании (${company.status_history_count}) | ${companyShortName}`"
    >
        <Spinner v-if="isLoading" small label="Загрузка истории.." />
        <p v-else-if="isError" class="text-center font-weight-semi">
            Ошибка при загрузке.. Попробуйте позже
        </p>
        <ElTimeline v-else>
            <CompanyBoxStatusHistory
                v-for="history in histories"
                :key="history.id"
                :history="history"
            />
        </ElTimeline>
        <template #actions="{ close }">
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">
                Закрыть просмотр
            </UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import api from '@/api/api.js';
import { useAsync } from '@/composables/useAsync.js';
import CompanyBoxStatusHistory from '@/components/Company/Box/CompanyBoxStatusHistory.vue';
import Spinner from '@/components/common/Spinner.vue';
import { ElTimeline } from 'element-plus';

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const companyShortName = computed(() => getCompanyShortName(props.company));

const { isLoading, isError, execute: fetchHistory } = useAsync(api.companies.statusHistory);

const histories = ref([]);

onBeforeMount(async () => {
    histories.value = await fetchHistory(props.company.id);
});
</script>
