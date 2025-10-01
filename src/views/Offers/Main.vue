<template>
    <section>
        <div class="container-fluid">
            <div class="row">
                <teleport to="body">
                    <FormComplex v-if="formIsVisible" @close="formIsVisible = false" />
                </teleport>
                <FormModalOfferSearch
                    v-if="searchingIsVisible"
                    @close="searchingIsVisible = false"
                />
                <FormOfferSearchExternal
                    @openFilters="searchingIsVisible = true"
                    class="col-12"
                    :offers-count="offersPagination ? offersPagination.totalCount : 0"
                    :objects-count="objectsCountInMap"
                />
                <div class="col-12 my-2">
                    <div class="company-table__filters">
                        <Chip
                            v-for="item in humanizedSelectedQueryFilters"
                            :key="item.value"
                            @delete="removeFilter(item.value)"
                            :value="item.value"
                            :html="item.label"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <UserFolders
                    v-model:selected="currentFolder"
                    category="offer_mix"
                    class="col-12"
                    movable
                    editable
                    selectable
                />
            </div>
            <div class="row my-2">
                <UiCol :cols="12">
                    <OfferMapBanner :current-folder />
                </UiCol>
            </div>
            <div class="row justify-content-between">
                <PaginationClassic
                    ref="firstPaginationEl"
                    @next="next"
                    class="col-12 col-md-6"
                    :pagination="offersPagination"
                    :loading="!offersPagination && isLoading"
                />
                <div class="company-table__actions col-12 col-md-4 align-items-center">
                    <Switch
                        v-if="!isMobile"
                        v-model="isCardView"
                        false-title="Таблица"
                        true-title="Карточки"
                        :disabled="isLoading"
                    />
                    |
                    <UiButton
                        @click="searchingIsVisible = true"
                        color="light"
                        :disabled="isLoading"
                        small
                        icon="fa-solid fa-plus"
                    >
                        Создать комплекс
                    </UiButton>
                </div>
            </div>
            <div class="row">
                <UiCol :cols="12" class="offers-page__table">
                    <AnimationTransition :speed="0.2">
                        <EmptyData v-if="!offers.length && !isLoading">Ничего не найдено</EmptyData>
                        <component
                            :is="currentViewComponentName"
                            v-else
                            @show-complex-objects="showComplexObjects"
                            @show-map="showOfferInMap"
                            @favorite-deleted="deleteFavoriteOffer"
                            @deleted-from-folder="onDeletedFromFolder"
                            @create-task="createTask"
                            :offers="offers"
                            :loader="isLoading"
                            :refreshing="isSilentLoading"
                        />
                    </AnimationTransition>
                </UiCol>
                <UiCol :cols="12">
                    <PaginationClassic
                        v-if="offersPagination"
                        @next="nextWithScroll"
                        :pagination="offersPagination"
                    />
                </UiCol>
            </div>
        </div>
        <teleport to="body">
            <UiModal v-model:visible="complexIsVisible" :title="complexModalTitle" :width="1400">
                <Spinner v-if="complexIsLoading" label="Загрузка комплекса.." />
                <div v-else>
                    <ObjectTable
                        :loader="complexIsLoading"
                        :objects="complexObjects"
                        :sortable="false"
                    />
                </div>
            </UiModal>
        </teleport>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import FormModalOfferSearch from '@/components/Forms/Offer/FormModalOfferSearch.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import OfferTableMobile from '@/components/Offer/OfferTableMobile.vue';
import OfferTable from '@/components/Offer/OfferTable.vue';
import Chip from '@/components/common/Chip.vue';
import FormComplex from '@/components/Forms/Complex/FormComplex.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useMobile } from '@/composables/useMobile.js';
import { computed, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTableContent } from '@/composables/useTableContent.js';
import { ActivePassiveFUCK, GateTypeList, YesNo } from '@/const/const.js';
import { dealOptions } from '@/const/options/deal.options.js';
import { objectOptions } from '@/const/options/object.options.js';
import { defaultsOptions } from '@/const/options/options.js';
import { floorOptions } from '@/const/options/floor.options.js';
import { locationOptions } from '@/const/options/location.options.js';
import FormOfferSearchExternal from '@/components/Forms/Offer/FormOfferSearchExternal.vue';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import UserFolders from '@/components/UserFolder/UserFolders.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useDebounceFn, useTimeoutFn } from '@vueuse/core';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import api from '@/api/api.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import Spinner from '@/components/common/Spinner.vue';
import ObjectTable from '@/components/ObjectTable/ObjectTable.vue';
import { useMapPreviewer } from '@/composables/useMapPreviewer.js';
import { useTaskManager } from '@/composables/useTaskManager.js';
import { userOptions } from '@/const/options/user.options.js';
import { useAuth } from '@/composables/useAuth';
import { useNotify } from '@/utils/use/useNotify.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { ucFirst } from '@/utils/formatters/string.js';
import { isArray } from '@/utils/helpers/array/isArray';
import UiCol from '@/components/common/UI/UiCol.vue';
import OfferMapBanner from '@/components/Offer/OfferMapBanner.vue';

const isMobile = useMobile();
const store = useStore();
const route = useRoute();
const router = useRouter();

const storeIsInitialized = computed({
    get() {
        return store.state.Offers.isInitialized;
    },
    set(value) {
        store.state.Offers.isInitialized = value;
    }
});

onMounted(() => {
    storeIsInitialized.value = true;
});

const firstPaginationEl = useTemplateRef('firstPaginationEl');

const isCardView = ref(false);
const formIsVisible = ref(false);

const isLoading = ref(false);
const isSilentLoading = ref(false);

const searchingIsVisible = ref(false);

const consultants = computed(() => store.getters.CONSULTANT_LIST);
const offersPagination = computed(() => store.getters.OFFERS_PAGINATION);
const offers = computed(() => store.getters.OFFERS);
const favoritesOffers = computed(() => store.getters.FAVORITES_OFFERS);

const currentViewComponentName = computed(() => {
    if (isMobile) return OfferTableMobile;
    return isCardView.value ? OfferTableMobile : OfferTable;
});

const gettersForFilters = {
    rangeMinElectricity: value => value + ' кВт',
    rangeMaxDistanceFromMKAD: value => value + ' км',
    deal_type: value => dealOptions.type[Number(value) + 1].toUpperCase(),
    agent_id: value => {
        if (consultants.value.length)
            return consultants.value.find(elem => elem.value == value).label;
        return null;
    },
    rangeMinArea: value => value + ' м<sup>2</sup>',
    rangeMaxArea: value => value + ' м<sup>2</sup>',
    rangeMinPricePerFloor: value => value + ' р',
    rangeMaxPricePerFloor: value => value + ' р',
    rangeMinCeilingHeight: value => value + ' м',
    rangeMaxCeilingHeight: value => value + ' м',
    class: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => objectOptions.class[elem]).join(', ');
    },
    gates: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => GateTypeList[elem]).join(', ');
    },
    heated: value => {
        if (!value) return null;
        return defaultsOptions.booleanSimple[value];
    },
    floor_types: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(elem => floorOptions.floorTypes[elem]).join(', ');
    },
    purposes: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value
            .map(element => {
                const param = objectOptions.purposes[element];
                return `<i title="${param.name}"" class="' ${param.icon} '"></i>`;
            })
            .join(', ');
    },
    object_type: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        return value.map(element => objectOptions.typeGeneral[element - 1].name).join(', ');
    },
    region: value => {
        if (!value || !store.getters.REGION_LIST) return null;
        const result = store.getters.REGION_LIST.find(region => region.value == value).label;

        if (route.query.polygon) {
            return '<p class="text-danger">' + result + '</p>';
        }

        return result;
    },
    district_moscow: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        const result = value.map(key => locationOptions.district[key]).join(', ');

        if (route.query.polygon) {
            return '<p class="text-danger">' + result + '</p>';
        }

        return result;
    },
    direction: value => {
        if (!value) return null;
        if (!Array.isArray(value)) value = [value];
        const result = value.map(elem => locationOptions.directionWithShort[elem].full).join(', ');

        if (route.query.polygon) {
            return '<p class="text-danger">' + result + '</p>';
        }

        return result;
    },
    status: value => {
        if (!value) return null;
        return ActivePassiveFUCK[value];
    },
    ad_realtor: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_cian: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_yandex: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_free: value => {
        if (!value) return null;
        return YesNo[value];
    },
    ad_avito: value => {
        if (!value) return null;
        return YesNo[value];
    },
    sort: value => value,
    cian_regions: value => {
        if (isArray(value) && !isEmptyArray(value)) {
            return value.map(element => locationOptions.cianRegion[element]).join(', ');
        }

        return null;
    }
};

const { humanizedSelectedQueryFilters } = useSelectedFilters({}, gettersForFilters);

const searchFavoritesOffers = () => store.dispatch('SEARCH_FAVORITES_OFFERS');

const formKeysOnlyArray = [
    'purposes',
    'class',
    'gates',
    'region',
    'direction',
    'district_moscow',
    'object_type',
    'floor_types',
    'cian_regions'
];

const getOffers = async (withLoader = true) => {
    if (isInitialLoading.value && storeIsInitialized.value && offers.value.length) {
        isSilentLoading.value = withLoader;
    } else {
        isLoading.value = withLoader;
    }

    const payload = createPayload();

    if (!favoritesOffers.value.length) await searchFavoritesOffers();

    if (route.query.favorites) {
        payload.original_id = [];
        payload.object_id = [];
        payload.complex_id = [];

        favoritesOffers.value.map(element => {
            payload.original_id.push(element.original_id);
            payload.object_id.push(element.object_id);
            payload.complex_id.push(element.complex_id);
        });

        payload.type_id = [1, 2];
    }

    await store.dispatch('SEARCH_OFFERS', { query: payload });

    isSilentLoading.value = false;
    isLoading.value = false;
};

const debouncedFetchOffers = useDebounceFn(getOffers, 300);

function createPayload() {
    const query = { ...route.query };

    singleToArrayByKeys(query, formKeysOnlyArray);

    store.state.Offers.offersFilters = { ...query };

    if (isNotNullish(query.deal_type) && query.deal_type == 0) {
        delete query.deal_type;
        query.deal_types = [0, 3];
    }

    query.type_id = [2, 3];
    query.expand =
        'contact.emails,contact.phones,' +
        'object,' +
        'company.mainContact.phones,company.mainContact.emails,company.objects_count,company.active_requests_count,company.active_contacts_count,' +
        'offer,' +
        'consultant.userProfile';

    if (isNotNullish(currentFolder.value)) {
        query.folder_ids = [currentFolder.value];
    }

    if (query.polygon) {
        query.polygon = query.polygon.join(',');
    }

    return query;
}

const deleteFavoriteOffer = async () => {
    const hasFavoritesFilter = route.query.favorites;

    if (hasFavoritesFilter) {
        await searchFavoritesOffers();
        await getOffers(false);
    }
};

const removeFilter = async filter => {
    const query = { ...route.query };

    if (filter === 'fakeRegion') {
        delete query['region'];
    }

    if (filter === 'region') {
        delete query['fakeRegion'];
        delete query['direction'];
        delete query['district_moscow'];
        delete query['outside_mkad'];
        delete query['region_neardy'];
    }

    delete query[filter];

    await router.replace({ query });
};

const { nextWithScroll, next, isInitialLoading } = useTableContent(getOffers, {
    scrollTo: firstPaginationEl,
    initQuery: async () => {
        const query = { ...route.query };

        const queryIsEmpty = Object.keys(query).length === 0;

        if (!queryIsEmpty) return;

        if (isNotNullish(store.state.Offers.offersFilters)) {
            await router.replace({ query: { ...store.state.Offers.offersFilters } });
        }
    }
});

const preparedQuery = computed(() => {
    const q = { ...route.query };

    delete q.page;
    delete q.sort;

    return JSON.stringify(q);
});

const objectsCountInMap = ref(0);

const fetchObjectsCountInMap = useDebounceFn(async () => {
    objectsCountInMap.value = Number(await api.offers.searchMapCount(createPayload()));
}, 100);

watch(preparedQuery, () => fetchObjectsCountInMap(), { immediate: true });

// folders

const currentFolder = ref(null);

watch(currentFolder, () => debouncedFetchOffers());

function onDeletedFromFolder(offerId, folderId) {
    if (isNotNullish(currentFolder.value) && currentFolder.value === folderId) {
        const offerIndex = store.state.Offers.offers.findIndex(offer => offer.id === offerId);
        if (offerIndex === -1) return;

        store.state.Offers.offers[offerIndex].isDeleting = true;

        useTimeoutFn(() => {
            store.state.Offers.offers.splice(offerIndex, 1);
        }, 500);
    }
}

// complex

const complexIsVisible = ref(false);
const complexIsLoading = ref(false);
const complexObjects = shallowRef([]);

const complexModalTitle = computed(() => {
    if (complexIsLoading.value) return 'Просмотр объектов в комплексе';

    return `Просмотр объектов (${complexObjects.value.length}) в комплексе`;
});

async function showComplexObjects(complexId) {
    complexIsLoading.value = true;
    complexIsVisible.value = true;

    try {
        const response = await api.object.search({
            complex_id: complexId,
            expand: 'offers,company.mainContact.phones,company.mainContact.emails,company.objects_count,company.active_requests_count,company.active_contacts_count'
        });

        complexObjects.value = response.data;
    } finally {
        complexIsLoading.value = false;
    }
}

// map

const { previewInMap } = useMapPreviewer();

function showOfferInMap(offer) {
    previewInMap({
        list: [offer],
        selected: offer.id
    });
}

// task

const { createTaskWithTemplate } = useTaskManager();
const { currentUserId } = useAuth();
const notify = useNotify();

const taskIsCreating = ref(false);

function getUserIdForTask(offer) {
    if (
        isNotNullish(offer.consultant) &&
        offer.consultant.role !== userOptions.roleStatement.SYSTEM
    ) {
        return offer.consultant.id;
    }

    if (isNotNullish(store.getters.moderator)) {
        return store.getters.moderator.id;
    }

    return currentUserId.value;
}

function getTaskRelations(offer) {
    const relations = [];

    if (isNotNullish(offer.company_id)) {
        relations.push({ entity_type: 'company', entity_id: offer.company_id });
    }

    if (isNotNullish(offer.object_id)) {
        relations.push({ entity_type: 'c_industry', entity_id: offer.object_id });
    }

    if (isNotNullish(offer.original_id)) {
        relations.push({ entity_type: 'offer_mix', entity_id: offer.id });
    }

    return relations;
}

function getTitleForTask(offer) {
    let parts = [`#${offer.visual_id}`];

    if (isNotNullish(offer.town_name) && isNotEmptyString(offer.town_name)) {
        parts.push(ucFirst(offer.town_name));
    } else if (isNotNullish(offer.region_name) && isNotEmptyString(offer.region_name)) {
        parts.push(ucFirst(offer.region_name));
    }

    if (isNotNullish(offer.company)) {
        parts.push(offer.company.full_name);
    }

    return parts.join(', ');
}

async function createTask(offer) {
    const taskPayload = await createTaskWithTemplate({
        title: getTitleForTask(offer),
        user_id: getUserIdForTask(offer),
        relations: getTaskRelations(offer)
    });

    if (!taskPayload) return;

    taskIsCreating.value = true;

    try {
        await api.task.create(taskPayload);
        notify.success('Задача успешно создана!');
    } finally {
        taskIsCreating.value = false;
    }
}
</script>
