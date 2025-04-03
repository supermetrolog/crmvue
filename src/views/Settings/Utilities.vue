<template>
    <div class="container-fluid">
        <Teleport to="body">
            <UiModal
                v-model:visible="purposesFixFormIsVisible"
                @closed="clearPurposesFixForm"
                :width="600"
                title="Object Land Purposes Fix"
            >
                <MultiSelect
                    v-model="purposesFixForm.object_id"
                    :disabled="purposesFixIsRunning"
                    label="ID объекта"
                    searchable
                    resolve-on-load
                    :delay="500"
                    :options="getObjectsOptions"
                    placeholder="ID объекта, адрес.."
                    :filter-results="false"
                    :min-chars="1"
                >
                    <template #option="{ option, isSelected }">
                        <div class="d-flex gap-2">
                            <LazyImage
                                :src="option.thumb"
                                style="height: 50px; min-width: 90px; max-width: 90px"
                            />
                            <div>
                                <p>
                                    Объект #{{ option.value }},
                                    <span :class="{ 'text-grey': !isSelected }">
                                        {{ option.is_land ? 'участок' : 'строение' }}</span
                                    >
                                </p>
                                <p class="fs-2" :class="{ 'text-grey': !isSelected }">
                                    {{ option.address }}
                                </p>
                                <p class="fs-2" :class="{ 'text-primary': !isSelected }">
                                    purposes: {{ option.purposes ?? '-' }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template #singlelabel="{ value: option }">
                        <div>
                            <p>
                                Объект #{{ option.value }},
                                <span class="text-grey">
                                    {{ option.is_land ? 'участок' : 'строение' }}</span
                                >
                            </p>
                            <p class="text-grey fs-2">{{ option.address }}</p>
                        </div>
                    </template>
                </MultiSelect>
                <template #actions="{ close }">
                    <UiButton
                        @click="runPurposesFix"
                        :disabled="!purposesFixForm.object_id"
                        :loading="purposesFixIsRunning"
                        color="success"
                    >
                        Выполнить
                    </UiButton>
                    <UiButton @click="close" :disabled="purposesFixIsRunning" color="danger">
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
        </Teleport>
        <div class="row">
            <UiCol :cols="8">
                <DashboardCard title="Инструменты модератора">
                    <div class="row">
                        <UiCol :cols="4">
                            <DashboardCard>
                                <p class="mb-1">Object Land Purposes Fix</p>
                                <p class="text-grey">Описание:</p>
                                <p>Исправить назначения объекта (участка)</p>
                                <UiButton
                                    @click="purposesFixFormIsVisible = true"
                                    small
                                    class="mt-2"
                                >
                                    Использовать
                                </UiButton>
                            </DashboardCard>
                        </UiCol>
                    </div>
                </DashboardCard>
            </UiCol>
            <UiCol :cols="4">
                <DashboardCard class="dashboard-stats-block">
                    <template #header>
                        <div class="dashboard-stats-block__header">
                            <h3 class="dashboard-card__title">
                                <span>Последние действия ({{ pagination?.totalCount ?? 0 }})</span>
                            </h3>
                            <UiButton
                                @click="fetchHistories"
                                small
                                color="light"
                                icon="fa-solid fa-refresh"
                                :loading="historiesIsLoading"
                            >
                                Обновить
                            </UiButton>
                        </div>
                    </template>
                    <div v-if="histories.length" class="d-flex flex-column gap-1 position-relative">
                        <Loader v-if="historiesIsLoading" />
                        <div
                            v-for="history in histories"
                            :key="history.id"
                            v-tippy="'Нажмите, чтобы посмотреть подробнее'"
                            class="py-1 px-2 dashboard-bg-light br-1 c-pointer"
                        >
                            <div class="d-flex gap-2 align-items-center">
                                <Avatar :src="history.initiator.userProfile.avatar" :size="40" />
                                <div>
                                    <p>
                                        {{ history.initiator.userProfile.medium_name }},
                                        <span class="text-grey fs-2">
                                            {{ getCreatedAt(history.created_at) }}
                                        </span>
                                    </p>
                                    <p class="text-grey fs-2">{{ eventToLabel(history.event) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Spinner v-else-if="historiesIsLoading" label="Загрузка истории" />
                    <EmptyData v-else>Действия отсутствуют..</EmptyData>
                </DashboardCard>
            </UiCol>
        </div>
    </div>
</template>
<script setup>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { onMounted, reactive, ref, toRaw } from 'vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import LazyImage from '@/components/common/LazyImage.vue';
import Avatar from '@/components/common/Avatar.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Spinner from '@/components/common/Spinner.vue';
import Loader from '@/components/common/Loader.vue';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';

const notify = useNotify();
const { confirm } = useConfirm();

const purposesFixFormIsVisible = ref(false);

const purposesFixIsRunning = ref(false);
const purposesFixForm = reactive({
    object_id: null
});

async function getObjectsOptions(querySearch) {
    let query = {
        expand: null
    };

    if (querySearch == null) {
        return [];
    } else {
        query.search = querySearch;
    }

    const response = await api.object.list(query);

    return response.data.map(element => ({
        value: element.id,
        address: element.address,
        thumb: element.thumb,
        purposes: element.purposes,
        is_land: element.is_land
    }));
}

function clearPurposesFixForm() {
    purposesFixForm.object_id = null;
}

async function runPurposesFix() {
    const confirmed = await confirm(
        'Исправить назначения',
        'Вы действительно хотите исправить назначения?'
    );
    if (!confirmed) return;

    purposesFixIsRunning.value = true;

    try {
        await api.object.fixLandPurposes(toRaw(purposesFixForm));

        notify.success('Назначения исправлены');
        fetchHistories();
    } finally {
        purposesFixIsRunning.value = false;
    }
}

// histories

const historiesIsLoading = ref(true);
const histories = ref([]);
const pagination = ref(null);

async function fetchHistories() {
    historiesIsLoading.value = true;

    try {
        const response = await api.utilityHistory.list({ sort: '-created_at', 'per-page': 0 });

        if (response) {
            histories.value = response.data;
            pagination.value = response.pagination;
        }
    } finally {
        historiesIsLoading.value = false;
    }
}

onMounted(fetchHistories);

// temporary

function eventToLabel(event) {
    return {
        'fix-land-object-purposes': 'Исправил назначения объекта',
        'reassign-consultants-to-companies': 'Переназначил консультанта для компаний'
    }[event];
}

function getCreatedAt(date) {
    return dayjsFromMoscow(date).fromNow();
}
</script>
