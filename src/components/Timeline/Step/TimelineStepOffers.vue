<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="2. Предложение возможных вариантов"
                    :success="isCompletedStep"
                    :paused="isPausedStep"
                    :step
                    :timeline
                >
                    <p>
                        Внимательно изучите автоподборки CRM или подберите варианты вручную и
                        отправьте клиенту
                    </p>
                    <template #footer>
                        <div class="d-flex gap-1">
                            <UiField color="white" small class="mb-2 font-weight-semi">
                                Выбрано {{ selectedObjectsCount }}
                            </UiField>
                            <UiField
                                v-if="submittedObjects.length"
                                color="white"
                                small
                                class="mb-2 font-weight-semi"
                            >
                                <i class="fa-solid fa-check" />
                                <span>Отправлено {{ submittedObjectsCount }}</span>
                            </UiField>
                        </div>
                        <div class="d-flex gap-2">
                            <TimelineButton
                                @click="sendModalIsVisible = true"
                                tooltip="Отправить презентации с объектами клиенту"
                                color="success"
                                :disabled="disabled || !selectedObjects.length"
                            >
                                <span>На почту!</span>
                                <i class="fa-solid fa-envelope icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                @click="selectAlreadySent"
                                tooltip="Уже отправил предложения по What's App!"
                                color="success"
                                :disabled="disabled || !selectedObjects.length"
                            >
                                <span>На What's App!</span>
                                <i class="fa-brands fa-whatsapp icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                @click="selectAlreadySent"
                                tooltip="Уже отправил предложения другим способом"
                                :active="step.negative"
                                :disabled="disabled || !selectedObjects.length"
                            >
                                <span>Отметить как отправленные</span>
                                <i class="fa-solid fa-envelope-circle-check icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                tooltip="Скачать выбранные предложения в PDF"
                                :disabled="!selectedObjects.length || disabled || true"
                                color="danger"
                            >
                                <span>Скачать выбранные</span>
                                <i class="fa-regular fa-floppy-disk icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                v-if="isPausedStep"
                                @click="setAsProcessed"
                                :disabled="disabled || isCompletedStep"
                                color="success"
                            >
                                <span>Снять с паузы</span>
                                <i class="fa-regular fa-circle-play icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                v-else
                                @click="pausedFormIsVisible = true"
                                :disabled="disabled || isCompletedStep"
                                color="warning"
                            >
                                <span>Шаг на паузу</span>
                                <i class="fa-regular fa-circle-pause icon"></i>
                            </TimelineButton>
                        </div>
                    </template>
                </TimelineInfo>
            </div>
            <UiCol :cols="12">
                <FormOfferSearch
                    @search="search"
                    @changed-query="currentPage = 1"
                    @reset="resetForm"
                    no-url
                    :query-params="queryParams"
                >
                    <template #buttons>
                        <Button
                            @click="resetSelectedObjects"
                            :disabled="!selectedObjects.length"
                            dark
                        >
                            <i class="fa-solid fa-xmark icon"></i>
                        </Button>
                    </template>
                </FormOfferSearch>
                <div class="d-flex gap-1 mt-1">
                    <TimelineStepOffersFiltersButton
                        @click="changeRecommendedFilter(1, totalRecommendedQuery)"
                        :active="currentRecommendedFilter === 1"
                        label="Лучшая"
                        :count="counts.total"
                        :loading="countsIsLoading"
                    >
                        <TimelineSearchRecommendations
                            :recommendations="TimelineRecommendedDescriptions[dealTypeKey].TOTAL"
                        />
                    </TimelineStepOffersFiltersButton>
                    <TimelineStepOffersFiltersButton
                        @click="changeRecommendedFilter(2, mediumRecommendedQuery)"
                        :active="currentRecommendedFilter === 2"
                        label="Расширенная"
                        :count="counts.medium"
                        :loading="countsIsLoading"
                    >
                        <TimelineSearchRecommendations
                            :recommendations="TimelineRecommendedDescriptions[dealTypeKey].MEDIUM"
                        />
                    </TimelineStepOffersFiltersButton>
                    <TimelineStepOffersFiltersButton
                        @click="changeRecommendedFilter(3, liteRecommendedQuery)"
                        :active="currentRecommendedFilter === 3"
                        label="Из пассива"
                        :count="counts.lite"
                        :loading="countsIsLoading"
                    >
                        <TimelineSearchRecommendations
                            :recommendations="TimelineRecommendedDescriptions[dealTypeKey].LITE"
                        />
                    </TimelineStepOffersFiltersButton>
                    <TimelineStepOffersButton
                        label="Моя подборка"
                        icon="fa-regular fa-circle-user"
                        disabled
                        info
                    />
                    <TimelineStepOffersButton
                        @click="isSubmittedView = !isSubmittedView"
                        :label="`Отправленные (${submittedObjects?.length ?? 0})`"
                        icon="fa-solid fa-envelope-open-text"
                        :disabled="!submittedObjects?.length"
                        :active="isSubmittedView"
                        info
                    />
                    <TimelineStepOffersButton
                        @click="toggleFavorites"
                        label="Избранные"
                        warning
                        icon="fa-regular fa-star"
                        :active="queryParams.favorites"
                        :count="favoritesCount"
                    />
                </div>
            </UiCol>
            <UiCol :cols="12">
                <TimelineStepOffersMap
                    v-if="isMapView"
                    @to-list="isMapView = false"
                    @refresh="search(searchParams)"
                    :objects="objects"
                    :selected-objects="selectedObjects"
                    :current-objects="step.objects"
                    :loading="isSearchLoading"
                    :counts="pagination?.totalCount"
                />
                <TimelineStepOffersTable
                    v-else
                    @to-map="isMapView = true"
                    @refresh="search(searchParams)"
                    @next-page="toNextPage"
                    @select="select"
                    @unselect="unselect"
                    @addComment="addObjectComment"
                    class="mx-1"
                    :favorite-deleted="deleteFavoriteOffer"
                    :objects="objects"
                    :selected-objects="selectedObjects"
                    :current-objects="step.objects"
                    :loading="isSearchLoading"
                    :pagination="pagination"
                    :submitted-view="isSubmittedView"
                    :already-submitted="alreadySubmittedObjects"
                    :already-visited="alreadyVisitedObjects"
                    :already-submitted-set="alreadySubmittedObjectsSet"
                    :already-visited-set="alreadyVisitedObjectsSet"
                />
            </UiCol>
        </div>
        <teleport to="body">
            <Modal
                @close="closeSendingModal"
                :show="sendModalIsVisible"
                title="Отправка объектов клиенту"
                width="1200"
            >
                <FormLetter
                    @send="sendNewStepObjects"
                    @alreadySent="setAsAlreadySent"
                    :already-sended="isAlreadySent"
                    :formdata="preparedLetterMessage"
                    :disabled="!selectedObjects.length"
                    :loading="isSending"
                >
                    <CompanyObjectsList
                        @select="select"
                        @unselect="unselect"
                        @addComment="addObjectComment"
                        :objects="selectedObjects"
                        :selected-objects="selectedObjects"
                        disabled
                        col="col-4"
                        label="Выбранные предложения"
                    />
                </FormLetter>
            </Modal>
            <UiModal
                v-model:visible="pausedFormIsVisible"
                @closed="clearForm"
                title="Постановка шага на паузу"
                :width="500"
            >
                <UiForm>
                    <UiFormGroup>
                        <UiDateInput
                            v-model="pauseDate"
                            :min-date="new Date()"
                            presets-label="Пауза на"
                            :presets="pausePresets"
                            required
                            placeholder="Выберите дату.."
                            label="Дата продолжения шага"
                            class="col-12"
                        />
                        <UiTextarea
                            v-model="pauseComment"
                            label="Комментарий"
                            :min-height="50"
                            :max-height="150"
                            auto-height
                            class="col-12"
                        />
                    </UiFormGroup>
                </UiForm>
                <template #actions="{ close }">
                    <UiButton
                        @click="setAsPaused"
                        color="success-light"
                        icon="fa-regular fa-circle-pause"
                        :disabled="!Boolean(pauseDate)"
                    >
                        Поставить на паузу
                    </UiButton>
                    <UiButton @click="close" color="light" icon="fa-solid fa-ban">
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
            <UiModal
                v-model:visible="isSubmittedView"
                title="Отправленные предложения"
                :width="1200"
            >
                <CompanyObjectsList
                    :objects="submittedObjects"
                    disabled
                    :current-step-id="step.id"
                    :label="submittedObjectsLabel"
                    col="col-4"
                />
            </UiModal>
        </teleport>
    </div>
</template>

<script setup>
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import Button from '@/components/common/Button.vue';
import Modal from '@/components/common/Modal.vue';
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import FormLetter from '@/components/Forms/FormLetter.vue';
import FormOfferSearch from '@/components/Forms/Offer/FormOfferSearch.vue';
import { entityOptions } from '@/const/options/options.js';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import { TimelineRecommendedDescriptions } from '@/const/const.js';
import TimelineSearchRecommendations from '@/components/Timeline/TimelineSearchRecommedations.vue';
import { regionsToFakeRegion } from '@/utils/normalizeForm.js';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';
import TimelineStepOffersButton from '@/components/Timeline/Step/TimelineStepOffersButton.vue';
import TimelineStepOffersFiltersButton from '@/components/Timeline/Step/TimelineStepOffersFiltersButton.vue';
import { computed, onBeforeMount, onMounted, reactive, ref, shallowRef, toRef } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import api from '@/api/api.js';
import { useTimelineContext } from '@/components/Timeline/useTimelineContext.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { useAuth } from '@/composables/useAuth';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import dayjs from 'dayjs';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { useDebounceFn } from '@vueuse/core';
import UiField from '@/components/common/UI/UiField.vue';
import { plural } from '@/utils/plural.js';
import TimelineStepOffersMap from '@/components/Timeline/Step/TimelineStepOffersMap.vue';
import TimelineStepOffersTable from '@/components/Timeline/Step/TimelineStepOffersTable.vue';
import { deepToRaw } from '@/utils/common/deepToRaw.js';

const emit = defineEmits(['update-step', 'updated-objects', 'next-step']);
const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    disabled: Boolean
});

const { generatePayload, request, timeline, isCompletedStep } = useTimelineContext(
    toRef(props, 'step')
);

const defaultQueryParams = {
    all: null,
    rangeMinElectricity: null,
    rangeMaxDistanceFromMKAD: null,
    deal_type: null,
    agent_id: null,
    rangeMaxArea: null,
    rangeMinArea: null,
    rangeMaxPricePerFloor: null,
    rangeMinPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    class: [],
    gates: [],
    heated: null,
    water: null,
    gas: null,
    steam: null,
    sewage_central: null,
    racks: null,
    railway: null,
    has_cranes: null,
    floor_types: [],
    purposes: [],
    object_type: [],
    region: [],
    direction: [],
    district_moscow: [],
    region_neardy: null,
    outside_mkad: null,
    status: null,
    // new fields
    recommended_sort: null,
    pricePerFloor: null,
    type_id: null,
    firstFloorOnly: null,
    withoutOffersFromQuery: null
};

const queryParams = ref({});

const letterMessage = computed(() => {
    const messageAuthor = `<p>С уважением, ${currentUser.value.userProfile.medium_name}</p>`;
    const messageAuthorPosition = `<p>${currentUserIsDirector.value ? 'Директор' : 'Менеджер'} департамента индустриальной недвижимости</p>`;

    let messageText = `<p>`;

    if (currentUser.value.userProfile.phones.length) {
        messageText +=
            'Моб: ' +
            `<a href="tel:${currentUser.value.userProfile.phones[0].phone.replace(/\D/g, '')}">${currentUser.value.userProfile.phones[0].phone}</a> `;
    }

    messageText += 'тел.офис: <a href="tel:74951500323">+7 (495) 150-03-23</a>';

    if (currentUser.value.userProfile.caller_id) {
        messageText += ' доб. ' + currentUser.value.userProfile.caller_id;
    }

    messageText += '</p><p>';

    if (currentUser.value.userProfile.emails.length) {
        messageText += `Эл. почта: <a href="mailto:${currentUser.value.userProfile.emails[0].email}">${currentUser.value.userProfile.emails[0].email}</a>, `;
    }

    messageText += 'веб.сайт: <a href="www.raysarma.ru">www.raysarma.ru</a></p>';

    return messageAuthor + messageAuthorPosition + messageText;
});

const preparedLetterMessage = computed(() => {
    const formData = {
        company_id: request.value.company_id,
        subject: 'Список предложений от RAYS ARMA',
        wayOfSending: [0],
        message: letterMessage.value
    };

    if (isNotNullish(defaultContactForSending.value)) {
        formData.defaultContactForSend = {
            contact_id: defaultContactForSending.value.contact_id,
            id: defaultContactForSending.value.id,
            value: defaultContactForSending.value.email,
            type: 1
        };
    }

    return formData;
});

const defaultContactForSending = computed(() => {
    if (request.value?.contact && request.value.contact.emails?.length) {
        return request.value.contact.emails[0];
    }

    return null;
});

function toNextPage(page) {
    if (page) currentPage.value = page;
    else currentPage.value++;
    fetchObjects(searchParams.value, true);
}

function getPercent(value, percent) {
    if (!Number.isInteger(value) || !value) return null;
    return Math.floor((value * percent) / 100);
}

// favorites

const store = useStore();

const FAVORITES_OFFERS = computed(() => store.getters.FAVORITES_OFFERS);
const favoritesCount = computed(() => store.getters.FAVORITES_OFFERS.length);

function toggleFavorites() {
    currentPage.value = 1;
    searchParams.value = {};

    const isFavorites = queryParams.value.favorites;

    if (isNotNullish(currentRecommendedFilter.value)) {
        changeRecommendedFilter(currentRecommendedFilter.value);

        queryParams.value.favorites = isFavorites ? null : true;
    } else {
        queryParams.value.favorites = isFavorites ? null : true;
        // debouncedFetchObjects(queryParams.value, true);
    }
}

async function deleteFavoriteOffer() {
    if (searchParams.value.favorites) {
        await store.dispatch('SEARCH_FAVORITES_OFFERS');
        await search(searchParams.value, false);
    }
}

// objects

const submittedObjects = computed(() => {
    return props.step.objects.map(item => {
        if (item.offer?.id) return { ...item.offer, duplicate_count: item.duplicate_count };
        else return { ...item, noOffer: true, duplicate_count: item.duplicate_count };
    });
});

const submittedObjectsLabel = computed(() => {
    return (
        'Выбранные предложения' +
        (submittedObjects.value?.length ? ` (${submittedObjects.value.length})` : '')
    );
});

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

function resetForm() {
    currentRecommendedFilter.value = null;
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
        timeline_id: timeline.value.id,
        ...structuredClone(deepToRaw(query)),
        page: currentPage.value
    };

    if (_query.status === 2) {
        _query.type_id = [3];
    }

    if (!FAVORITES_OFFERS.value.length) await store.dispatch('SEARCH_FAVORITES_OFFERS');
    if (_query.favorites) {
        _query.original_id = FAVORITES_OFFERS.value.map(item => item.original_id);
        _query.object_id = FAVORITES_OFFERS.value.map(item => item.object_id);
        _query.complex_id = FAVORITES_OFFERS.value.map(item => item.complex_id);
    }

    if (isMapView.value) {
        fetchMapCounts(_query);
    }

    const data = await api.companyObjects.searchOffers(_query);

    setObjects(data);

    if (withLoader) isSearchLoading.value = false;
}

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
        counts.offers = Number(offersCount);
    } catch (error) {
        counts.offers = 0;
    }
}

// selecting

const selectedObjects = ref([]);

const selectedObjectsCount = computed(() => {
    return plural(
        selectedObjects.value.length,
        '%d предложение',
        '%d предложения',
        '%d предложений'
    );
});

const submittedObjectsCount = computed(() => {
    return plural(
        submittedObjects.value.length,
        '%d предложение',
        '%d предложения',
        '%d предложений'
    );
});

function resetSelectedObjects() {
    selectedObjects.value = [];
}

function select(object) {
    selectedObjects.value.push(object);
}

function unselect(object) {
    spliceById(selectedObjects.value, object.id);
}

function addObjectComment(objectID, comment) {
    const objectIndex = selectedObjects.value.findIndex(element => element.id === objectID);

    if (objectIndex !== -1) {
        selectedObjects.value[objectIndex].comment = comment;
        return true;
    }

    return false;
}

// counts

const countsIsLoading = ref(false);
const counts = reactive({
    total: 0,
    medium: 0,
    lite: 0
});

async function fetchCounts() {
    const query = {
        type_id: [1, 2, 3],
        'per-page': 1,
        timeline_id: timeline.value.id,
        ...structuredClone(defaultQueryParams)
    };

    const totalQuery = {
        ...query,
        ...structuredClone(deepToRaw(totalRecommendedQuery.value))
    };

    const mediumQuery = {
        ...query,
        ...structuredClone(deepToRaw(mediumRecommendedQuery.value))
    };

    const liteQuery = {
        ...query,
        ...structuredClone(deepToRaw(liteRecommendedQuery.value))
    };

    countsIsLoading.value = true;

    const [totalResult, mediumResult, liteResult] = await Promise.allSettled([
        api.companyObjects.searchOffers(totalQuery),
        api.companyObjects.searchOffers(mediumQuery),
        api.companyObjects.searchOffers(liteQuery)
    ]);

    counts.total = totalResult.value?.pagination?.totalCount;
    counts.medium = mediumResult.value?.pagination?.totalCount;
    counts.lite = liteResult.value?.pagination?.totalCount;

    countsIsLoading.value = false;
}

onMounted(fetchCounts);

// queries

const route = useRoute();

const dealTypeKey = computed(() => {
    if (request.value.dealType + 1 === entityOptions.deal.typeStatement.SALE) return 'SALE';
    return 'RENT';
});

const currentRecommendedFilter = ref(null);

const totalRecommendedQuery = shallowRef(generateTotalRecommendedQuery());
const mediumRecommendedQuery = shallowRef(generateMediumRecommendedQuery());
const liteRecommendedQuery = shallowRef(generateLiteRecommendedQuery());

function generateTotalRecommendedQuery() {
    const query = {
        rangeMinElectricity: request.value.electricity,
        rangeMaxDistanceFromMKAD: getPercent(request.value.distanceFromMKAD, 130),
        deal_type: request.value.dealType,
        rangeMaxArea: request.value.maxArea,
        rangeMinArea: request.value.minArea,
        rangeMaxPricePerFloor: getPercent(request.value.pricePerFloor, 130),
        rangeMinCeilingHeight: request.value.minCeilingHeight,
        heated: request.value.heated === 0 ? 2 : request.value.heated,
        has_cranes: request.value.haveCranes,
        floor_types: request.value.antiDustOnly ? [2] : [],
        region: request.value.regions.map(item => item.region),
        status: 1,
        type_id: [1, 2],
        gates: request.value.gateTypes.map(item => item.gate_type),
        fakeRegion: regionsToFakeRegion(
            request.value.regions.map(item => item.region),
            request
        ),
        direction: request.value.directions.map(item => item.direction),
        district_moscow: request.value.districts.map(item => item.district),
        region_neardy: request.value.region_neardy,
        outside_mkad: request.value.outside_mkad,
        firstFloorOnly: request.value.firstFloorOnly ? 1 : null,
        sort_original_id: route.query.new_original_id ?? null,
        sort: route.query.new_original_id ? '-original_ids' : null,
        purposes: []
    };

    if (request.value.dealType + 1 === entityOptions.deal.typeStatement.SALE) {
        query.rangeMaxArea = getPercent(request.value.maxArea, 130);
        query.rangeMinArea = getPercent(request.value.minArea, 80);
    }

    return query;
}

function generateMediumRecommendedQuery() {
    const query = {
        rangeMaxDistanceFromMKAD: getPercent(request.value.distanceFromMKAD, 130),
        deal_type: request.value.dealType,
        status: 1,
        type_id: [1, 2],
        firstFloorOnly: request.value.firstFloorOnly ? 1 : null,
        withoutOffersFromQuery: JSON.stringify(
            deleteEmptyFields(
                {
                    ...structuredClone(totalRecommendedQuery.value),
                    page: 1,
                    'per-page': 0,
                    expand: 'object,offer,generalOffersMix.offer,comments',
                    timeline_id: timeline.value.id
                },
                true
            )
        ),
        purposes: []
    };

    if (request.value.dealType + 1 === entityOptions.deal.typeStatement.SALE) {
        query.rangeMaxPricePerFloor = getPercent(request.value.pricePerFloor, 150);
        query.rangeMaxDistanceFromMKAD = getPercent(request.value.distanceFromMKAD, 150);
    } else {
        query.rangeMinCeilingHeight =
            request.value.minCeilingHeight > 3
                ? request.value.minCeilingHeight - 2
                : request.value.minCeilingHeight;

        query.rangeMaxArea = getPercent(request.value.maxArea, 120);
        query.rangeMinArea = getPercent(request.value.minArea, 80);
        query.floor_types = request.value.antiDustOnly ? [2] : [];
        query.has_cranes = request.value.haveCranes;
    }

    return query;
}

function generateLiteRecommendedQuery() {
    const query = {
        rangeMaxDistanceFromMKAD: getPercent(request.value.distanceFromMKAD, 130),
        rangeMaxArea: request.value.maxArea,
        rangeMinArea: request.value.minArea,
        type_id: [3],
        region: request.value.regions.map(item => item.region),
        direction: request.value.directions.map(item => item.direction),
        district_moscow: request.value.districts.map(item => item.district),
        region_neardy: request.value.region_neardy,
        outside_mkad: request.value.outside_mkad,
        fakeRegion: regionsToFakeRegion(
            request.value.regions.map(item => item.region),
            request.value
        ),
        purposes: []
    };

    if (request.value.dealType + 1 === entityOptions.deal.typeStatement.SALE) {
        query.rangeMaxArea = getPercent(request.value.maxArea, 130);
        query.rangeMinArea = getPercent(request.value.minArea, 70);
    }

    return query;
}

function changeRecommendedFilter(filter, query) {
    if (currentRecommendedFilter.value === filter) {
        currentRecommendedFilter.value = null;
        queryParams.value = structuredClone(defaultQueryParams);
        return;
    }

    currentPage.value = 1;
    currentRecommendedFilter.value = filter;
    queryParams.value = {
        ...structuredClone(defaultQueryParams),
        ...structuredClone(deepToRaw(query))
    };
}

onBeforeMount(() => {
    changeRecommendedFilter(1, totalRecommendedQuery.value);
});

// events

const isAlreadySent = ref(false);
const sendModalIsVisible = ref(false);

function selectAlreadySent() {
    isAlreadySent.value = true;
    sendModalIsVisible.value = true;
}

function closeSendingModal() {
    sendModalIsVisible.value = false;
    isAlreadySent.value = false;
}

async function setAsAlreadySent(payload) {
    const {
        wayOfSending = 0,
        contactForSendMessage = null,
        contacts = [],
        company_id = null
    } = payload;

    try {
        isSending.value = true;

        const letterID = await sendLetterWithStepObjects(wayOfSending, false, contacts, company_id);
        if (!letterID) return false;

        // this.step.newActionComments = [
        //     new AlreadySendOffersComment(
        //         this.step,
        //         this.selectedObjects.length,
        //         contactForSendMessage,
        //         wayOfSending,
        //         letterID
        //     )
        // ];

        await sendStepObjects();
        emit('next-step');
    } catch (error) {
        console.log(error);
    } finally {
        isSending.value = false;
    }
}

// sending

const { currentUser, currentUserIsDirector } = useAuth();
const notify = useNotify();

const isGeneralLoading = ref(false);

async function sendLetterWithStepObjects(
    wayOfSending,
    sendClientFlag,
    contacts,
    company_id,
    comment = null,
    subject = null
) {
    isGeneralLoading.value = true;

    const objectsParams = selectedObjects.value.map(item => ({
        object_id: item.object_id,
        original_id: item.original_id,
        type_id: item.type_id,
        consultant: currentUser.value.userProfile.full_name
    }));

    try {
        const letterId = await api.letter.sendOffer({
            contacts,
            shipping_method: sendClientFlag ? 1 : 0,
            offers: objectsParams,
            body: comment,
            ways: wayOfSending,
            sendClientFlag,
            subject,
            company_id
        });

        if (!letterId) {
            notify.error('Не удалось отправить объекты!');
        }

        return letterId;
    } finally {
        isGeneralLoading.value = false;
    }
}

function generateSelectedObjectsPayload() {
    return selectedObjects.value.map(item => ({
        object_id: item.object_id,
        offer_id: item.original_id,
        type_id: item.type_id,
        comment: item.comment
    }));
}

const isSending = ref(false);

async function sendNewStepObjects(event) {
    const {
        message,
        wayOfSending,
        contactForSendMessage = null,
        contacts,
        subject,
        company_id
    } = event;

    try {
        isSending.value = true;

        const letterId = await sendLetterWithStepObjects(
            wayOfSending,
            true,
            contacts,
            company_id,
            message,
            subject
        );

        if (letterId) {
            // this.step.newActionComments = [
            //     this.getSendComment(
            //         this.step,
            //         this.selectedObjects.length,
            //         contactForSendMessage,
            //         wayOfSending,
            //         letterID
            //     )
            // ];

            await sendStepObjects();

            emit('next-step');
        }
    } catch (error) {
        console.log(error);
    } finally {
        isSending.value = false;
    }
}

async function sendStepObjects() {
    const payload = generatePayload({
        negative: 0,
        additional: 0,
        status: 1,
        done: 1,
        objects: generateSelectedObjectsPayload()
    });

    try {
        const isUpdated = await api.timeline.updateTimelineStep(payload.id, payload);

        if (isUpdated) {
            emit('updated-objects', payload);
            resetSelectedObjects();
        }
    } catch (error) {
        console.log(error);
    }
}

// map view

const isMapView = ref(false);
const isSubmittedView = ref(false);

// pause event

const pausedFormIsVisible = ref(false);
const pauseDate = ref(null);
const pauseComment = ref(null);

const pausePresets = [
    {
        value: dayjs().add(1, 'day').toDate(),
        label: '1 день'
    },
    {
        value: dayjs().add(2, 'day').toDate(),
        label: '2 дня'
    },
    {
        value: dayjs().add(3, 'day').toDate(),
        label: '3 дня'
    },
    {
        value: dayjs().add(5, 'day').toDate(),
        label: '5 дней'
    },
    {
        value: dayjs().add(7, 'day').toDate(),
        label: 'Неделю'
    },
    {
        value: dayjs().add(14, 'day').toDate(),
        label: '2 недели'
    }
];

function clearForm() {
    pauseDate.value = null;
    pauseComment.value = null;
}

function setAsPaused() {
    emit(
        'update-step',
        generatePayload({
            negative: 1,
            date: dayjs(pauseDate.value).toJSON(),
            comment: pauseComment.value
        })
    );

    pausedFormIsVisible.value = false;
    clearForm();
}

function setAsProcessed() {
    emit('update-step', generatePayload({ negative: 0, date: null, comment: null }));
}

const isPausedStep = computed(() => props.step.negative);

const alreadySubmittedObjects = computed(() => store.state.Timeline.alreadySubmittedObjects);
const alreadyVisitedObjects = computed(() => store.state.Timeline.alreadyVisitedObjects);
const alreadySubmittedObjectsSet = computed(() => store.state.Timeline.alreadySubmittedObjectsSet);
const alreadyVisitedObjectsSet = computed(() => store.state.Timeline.alreadyVisitedObjectsSet);
</script>
