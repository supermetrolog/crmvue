<template>
    <div>
        <template v-if="requests?.actual?.length || requests?.archived?.length">
            <DashboardChip class="mb-1 dashboard-bg-light">Актуальные запросы:</DashboardChip>
            <div class="d-flex gap-2 flex-wrap">
                <UiChip
                    v-for="requestId in requests.actual"
                    :key="requestId"
                    class="dashboard-bg-success-l"
                >
                    #{{ requestId }}
                </UiChip>
            </div>
            <DashboardChip class="my-1 dashboard-bg-light">Архивированные запросы:</DashboardChip>
            <div class="d-flex gap-2 flex-wrap">
                <UiChip
                    v-for="requestId in requests.archived"
                    :key="requestId"
                    class="dashboard-bg-danger-l"
                >
                    #{{ requestId }}
                </UiChip>
            </div>
        </template>
        <DashboardChip v-else class="my-2 dashboard-bg-light">
            Информация отсутствует..
        </DashboardChip>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UiChip from '@/components/common/UI/UiChip.vue';

const props = defineProps({
    answers: {
        type: Array,
        required: true
    }
});

const requests = computed(() => props.answers[0].surveyQuestionAnswer.value);
</script>
