<template>
    <div>
        <div v-if="isLoading" class="skeleton-body d-flex gap-1">
            <UiField color="light" class="skeleton">11 звонков</UiField>
            <UiField color="light" class="skeleton">11 звонков</UiField>
            <UiField color="light" class="skeleton">11 звонков</UiField>
        </div>
        <div v-else>
            <div class="d-flex gap-1 flex-wrap">
                <UiField v-if="pagination" color="light">
                    <i class="fa-solid fa-phone" />
                    <span>{{ callsCountLabel }}</span>
                </UiField>
                <UiField v-if="calls.length > 0" color="light" tooltip="Последний звонок">
                    <i class="fa-regular fa-clock" />
                    <span>{{ lastCallDate }}, {{ lastCallConsultant }}</span>
                </UiField>
            </div>
            <div class="d-flex gap-1 flex-wrap mt-1">
                <UiField v-if="lastThreeCallsIsUnavailable" color="danger-light">
                    <i class="fa-solid fa-exclamation-triangle" />
                    <span>
                        Не удалось дозвониться уже более 3х раз, последний {{ lastCallDate }}
                    </span>
                </UiField>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import api from '@/api/api.js';
import UiField from '@/components/common/UI/UiField.vue';
import { plural } from '@/utils/plural.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const isLoading = ref(false);
const calls = ref([]);
const pagination = ref(null);

async function fetchCalls() {
    isLoading.value = true;

    try {
        const response = await api.call.list({ contact_id: props.contact.id, 'per-page': 3 });

        calls.value = response.data;
        pagination.value = response.pagination;
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchCalls);

const callsCountLabel = computed(() => {
    if (calls.value.length > 0) {
        return plural(pagination.value.totalCount, '%d звонок', '%d звонка', '%d звонков');
    }

    return 'Нет звонков';
});

const lastCallDate = computed(() => {
    if (calls.value.length > 0) {
        return toBeautifulDateFormat(calls.value[0].created_at);
    }

    return null;
});

const lastCallConsultant = computed(() => {
    if (calls.value.length > 0) {
        return calls.value[0].user.userProfile.medium_name;
    }

    return null;
});

const lastThreeCallsIsUnavailable = computed(() => {
    if (calls.value.length > 0) {
        return calls.value.slice(0, 3).every(element => element.status === 0);
    }

    return false;
});
</script>
