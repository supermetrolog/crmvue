<template>
    <div class="messenger-quiz-question-call__description">
        <span v-if="isLoading" class="skeleton">
            Последний звонок 11.11.1111. Всего звонков 1111
        </span>
        <div v-else>
            <i>
                <span>{{ callsCountLabel }}</span>
                <span v-if="calls.length">
                    Последний звонок {{ lastCallDate }}, {{ lastCallConsultant }}
                </span>
            </i>
            <p v-if="lastThreeCallsIsUnavailable" class="text-danger">
                <i>Не удалось дозвониться уже более 3х раз подряд!</i>
            </p>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import { plural } from '@/utils/plural.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const isLoading = ref(false);
const calls = shallowRef([]);
const pagination = shallowRef(null);

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
        return `Всего ${plural(pagination.value.totalCount, '%d звонок', '%d звонка', '%d звонков')}.`;
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
