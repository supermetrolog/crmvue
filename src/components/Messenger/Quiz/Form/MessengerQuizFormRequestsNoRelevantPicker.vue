<template>
    <div class="messenger-quiz-form-request-picker w-100">
        <Spinner v-if="isLoading" class="mini" center />
        <template v-else-if="requests.length">
            <DashboardChip class="dashboard-bg-light mb-1">
                Выберите, какие из запросов являются актуальными
            </DashboardChip>
            <div class="messenger-quiz-form-request-picker__list">
                <MessengerQuizFormRequestsNoRelevantPickerElement
                    v-for="request in requests"
                    :key="request.id"
                    @click="selectRequest(request.id)"
                    :request="request"
                    :class="{ active: selectedRequestsSet.has(request.id) }"
                    :disabled
                />
            </div>
        </template>
        <DashboardChip v-else class="dashboard-bg-light mt-1">
            У компании нет активных запросов
        </DashboardChip>
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '@/api/api.js';
import MessengerQuizFormRequestsNoRelevantPickerElement from '@/components/Messenger/Quiz/Form/MessengerQuizFormRequestsNoRelevantPickerElement.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Spinner from '@/components/common/Spinner.vue';
import { spliceWithPrimitive } from '@/utils/helpers/array/spliceWithPrimitive.js';

const modelValue = defineModel();
const emit = defineEmits(['set-as-disabled']);
const props = defineProps({
    disabled: Boolean,
    companyId: {
        type: Number,
        required: true
    }
});

const selectedRequestsSet = ref(new Set());

function selectRequest(requestId) {
    if (selectedRequestsSet.value.has(requestId)) {
        selectedRequestsSet.value.delete(requestId);

        modelValue.value.archived.push(requestId);
        spliceWithPrimitive(modelValue.value.actual, requestId);
    } else {
        selectedRequestsSet.value.add(requestId);

        modelValue.value.actual.push(requestId);
        spliceWithPrimitive(modelValue.value.archived, requestId);
    }
}

watch(
    () => props.disabled,
    value => {
        if (value) {
            selectedRequestsSet.value.clear();
            modelValue.value.actual = [];
            modelValue.value.archived = [];
        }
    }
);

const isLoading = ref(true);
const requests = ref([]);

async function fetchRequests() {
    isLoading.value = true;

    const response = await api.request.byCompanyId(props.companyId);
    if (response) requests.value = response;

    isLoading.value = false;
}

onMounted(async () => {
    await fetchRequests();
    if (!requests.value.length) emit('set-as-disabled');
    modelValue.value.archived = requests.value.map(request => request.id);
});

function setValue(value) {
    selectedRequestsSet.value.clear();

    if (value.archived?.length) {
        modelValue.value.archived = [...value.archived];
    } else {
        modelValue.value.archived = [];
    }

    if (value.actual?.length) {
        value.actual.forEach(id => {
            selectRequest(id);
        });
    }
}

defineExpose({ setValue });
</script>
