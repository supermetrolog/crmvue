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
                    :objects-count="offersPagination ? offersPagination.totalCount : 0"
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
            <div v-if="offersPagination" class="row justify-content-between">
                <PaginationClassic
                    ref="firstPaginationEl"
                    @next="next"
                    class="col-12 col-md-6"
                    :pagination="offersPagination"
                />
                <div class="company-table__actions col-12 col-md-4">
                    <Switch
                        v-if="!isMobile"
                        v-model="isCardView"
                        false-title="Таблица"
                        true-title="Карточки"
                    />
                    <Button @click="searchingIsVisible = true" success :disabled="isLoading">
                        Создать комплекс
                    </Button>
                    <RefreshButton @click="getOffers(true)" :disabled="isLoading" />
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <AnimationTransition :speed="0.2">
                        <component
                            :is="currentViewComponentName"
                            v-if="offers.length"
                            @favorite-deleted="deleteFavoriteOffer"
                            :offers="offers"
                            :loader="isLoading"
                        />
                        <template v-else>
                            <Loader v-if="isLoading" />
                            <EmptyData v-else>Ничего не найдено</EmptyData>
                        </template>
                    </AnimationTransition>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        v-if="offersPagination"
                        @next="nextWithScroll"
                        :pagination="offersPagination"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import RefreshButton from '@/components/common/RefreshButton.vue';
import FormModalOfferSearch from '@/components/Forms/Offer/FormModalOfferSearch.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Loader from '@/components/common/Loader.vue';
import OfferTableMobile from '@/components/Offer/OfferTableMobile.vue';
import OfferTable from '@/components/Offer/OfferTable.vue';
import Chip from '@/components/common/Chip.vue';
import FormComplex from '@/components/Forms/Complex/FormComplex.vue';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useMobile } from '@/composables/useMobile.js';
import { computed, shallowRef, useTemplateRef } from 'vue';
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

const isMobile = useMobile();
const store = useStore();
const route = useRoute();
const router = useRouter();

const firstPaginationEl = useTemplateRef('firstPaginationEl');

const isCardView = shallowRef(false);
const formIsVisible = shallowRef(false);
const isLoading = shallowRef(false);
const searchingIsVisible = shallowRef(false);

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
    sort: value => value
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
    'floor_types'
];

const getOffers = async (withLoader = true) => {
    isLoading.value = withLoader;

    const query = { ...route.query };
    singleToArrayByKeys(query, formKeysOnlyArray);

    query.type_id = [2, 3];
    query.expand =
        'contact.emails,contact.phones,' +
        'object,' +
        'company.mainContact.phones,company.mainContact.emails,company.objects_count,company.requests_count,company.contacts_count,' +
        'offer,' +
        'consultant.userProfile';

    if (!favoritesOffers.value.length) await searchFavoritesOffers();
    if (route.query.favorites) {
        query.original_id = [];
        query.object_id = [];
        query.complex_id = [];

        favoritesOffers.value.map(element => {
            query.original_id.push(element.original_id);
            query.object_id.push(element.object_id);
            query.complex_id.push(element.complex_id);
        });

        query.type_id = [1, 2];
    }

    await store.dispatch('SEARCH_OFFERS', { query });
    isLoading.value = false;
};

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

const { nextWithScroll, next } = useTableContent(getOffers, {
    scrollTo: firstPaginationEl,
    initQuery: () => {}
});
</script>
