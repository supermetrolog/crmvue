<template>
    <section class="pdf-page">
        <div class="container-fluid position-relative">
            <AnimationTransition :speed="0.4">
                <div v-if="selectedObjects.length" class="selected-card">
                    <p class="font-weight-semi mb-2">{{ selectedObjectsLabel }}</p>
                    <div class="d-flex gap-2">
                        <UiButton
                            @click="downloadPdf"
                            :loading="isDownloading"
                            color="white"
                            icon="fa-solid fa-file-pdf"
                            small
                        >
                            Скачать
                        </UiButton>
                        <span class="align-self-center">|</span>
                        <UiButton
                            @click="selectAll"
                            :disabled="isDownloading"
                            color="white"
                            icon="fa-solid fa-check"
                            small
                        >
                            Выбрать все
                        </UiButton>
                        <UiButton
                            @click="resetSelectedObjects"
                            :disabled="isDownloading"
                            color="white"
                            icon="fa-solid fa-trash"
                            small
                        >
                            Очистить
                        </UiButton>
                    </div>
                </div>
            </AnimationTransition>
            <div class="row">
                <UiCol :cols="12" class="mb-2">
                    <div class="white-block">
                        <FormOfferSearch
                            @search="search"
                            @changed-query="currentPage = 1"
                            :query-params
                            no-url
                        />
                    </div>
                </UiCol>
                <UiCol :cols="12">
                    <TimelineStepOffersMap
                        v-if="isMapView"
                        @to-list="isMapView = false"
                        @refresh="search(searchParams)"
                        :counts="pagination?.totalCount"
                        :loading="isSearchLoading"
                        :selected-objects
                        :objects
                    />
                    <TimelineStepOffersTable
                        v-else
                        @to-map="isMapView = true"
                        @refresh="search(searchParams)"
                        @next-page="toNextPage"
                        @select="select"
                        @unselect="unselect"
                        :loading="isSearchLoading"
                        :objects
                        :selected-objects
                        :pagination
                    />
                </UiCol>
            </div>
        </div>
    </section>
</template>

<script setup>
import api from '@/api/api.js';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useDebounceFn } from '@vueuse/core';
import FormOfferSearch from '@/components/Forms/Offer/FormOfferSearch.vue';
import TimelineStepOffersMap from '@/components/Timeline/Step/TimelineStepOffersMap.vue';
import TimelineStepOffersTable from '@/components/Timeline/Step/TimelineStepOffersTable.vue';
import { deepToRaw } from '@/utils/common/deepToRaw.js';
import { plural } from '@/utils/plural.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { captureException } from '@sentry/vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useNotify } from '@/utils/use/useNotify.js';

const queryParams = ref({
    status: 1
});

function toNextPage(page) {
    if (page) currentPage.value = page;
    else currentPage.value++;
    fetchObjects(searchParams.value, true);
}

// objects

const objects = ref([]);
const pagination = ref(null);
const currentPage = ref(1);

const searchMode = ref(false);
const searchParams = ref({});
const isSearchLoading = ref(false);

function setObjects(data) {
    objects.value = data.data;
    pagination.value = data.pagination;
}

async function fetchObjects(query = {}, withLoader = true) {
    if (withLoader) isSearchLoading.value = true;

    const _query = {
        type_id: [1, 2, 3],
        'per-page': 20,
        expand:
            'object,offer,generalOffersMix.offer,comments,' +
            'contact.emails,contact.phones,' +
            'consultant.userProfile,' +
            'company.mainContact.phones,company.mainContact.emails,company.objects_count,company.active_requests_count,company.active_contacts_count',
        ...structuredClone(deepToRaw(query)),
        page: currentPage.value
    };

    if (_query.status === 2) {
        _query.type_id = [3];
    }

    if (isMapView.value) {
        void fetchMapCounts(_query);
    }

    const data = await api.companyObjects.searchOffers(_query);

    setObjects(data);

    if (withLoader) isSearchLoading.value = false;
}

onBeforeMount(() => {
    fetchObjects();
    fetchMapCounts();
});

const debouncedFetchObjects = useDebounceFn(fetchObjects, 300);

async function search(params, withLoader = true) {
    searchParams.value = params;
    searchMode.value = true;

    await debouncedFetchObjects(params, withLoader);
}

// map counts

const mapCounts = reactive({
    offers: 0
});

async function fetchMapCounts(query) {
    try {
        const offersCount = await api.offers.searchCount(query);

        mapCounts.offers = Number(offersCount);
    } catch (error) {
        captureException(error);

        mapCounts.offers = 0;
    }
}

// selecting

const selectedObjects = ref([]);

const selectedObjectsLabel = computed(() => {
    return plural(
        selectedObjects.value.length,
        'Выбрано %d предложение',
        'Выбрано %d предложения',
        'Выбрано %d предложений'
    );
});

function resetSelectedObjects() {
    selectedObjects.value = [];
}

function select(object) {
    selectedObjects.value.push({
        id: object.id,
        original_id: object.original_id,
        object_id: object.object_id,
        type_id: object.type_id
    });
}

function unselect(object) {
    spliceById(selectedObjects.value, object.id);
}

function selectAll() {
    selectedObjects.value = objects.value.map(obj => ({
        id: object.id,
        original_id: obj.original_id,
        object_id: obj.object_id,
        type_id: obj.type_id
    }));
}

// map view

const isMapView = ref(false);

// download

const { currentUserId } = useAuth();

function generatePayload() {
    return {
        consultant: currentUserId.value,
        is_new: true,
        objects: selectedObjects.value
    };
}

const notify = useNotify();

const isDownloading = ref(false);

async function downloadPdf() {
    isDownloading.value = true;

    try {
        const response = await api.pdf.download(generatePayload());
        console.log(response);
    } catch (error) {
        captureException(error);

        notify.error(error.message, 'Ошибка запроса');
    }

    isDownloading.value = false;
}
</script>
<style>
.selected-card {
    position: fixed;
    top: 85px;
    right: 15px;
    z-index: 100;
    padding: 10px;
    border-radius: 5px;
    background-color: #ededed;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    border: 1px solid #ddd;
}
</style>
