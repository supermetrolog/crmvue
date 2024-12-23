<template>
    <section>
        <div class="container-fluid">
            <div ref="searchEl" class="row">
                <teleport to="body">
                    <FormModalOfferSearch
                        v-if="searchingIsVisible"
                        @close="searchingIsVisible = false"
                    />
                </teleport>
                <FormOfferSearchExternal
                    @open-filters="searchingIsVisible = true"
                    class="col-12"
                    :offers-count="counts.offers"
                    :objects-count="counts.objects"
                    :is-map="true"
                />
                <div class="col-12 my-2">
                    <div class="company-table__filters">
                        <Chip
                            v-for="(item, index) in selectedFilterList"
                            :key="index"
                            @delete="removeFilter(item.value)"
                            :value="item.value"
                            :html="item.label"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <OfferYmap
                        @selection-done="filterByPolygon"
                        @removed-done="onRemovePolygonFromFilters"
                        :list="offers"
                        :polygon-coordinates="polygonCoordinates"
                        :styles="yandexMapStyles"
                        :loading="isLoading"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import api from '@/api/api';
import FormModalOfferSearch from '@/components/Forms/Offer/FormModalOfferSearch.vue';
import FormOfferSearchExternal from '@/components/Forms/Offer/FormOfferSearchExternal.vue';
import OfferYmap from '@/components/Offer/OfferYmap.vue';
import Chip from '@/components/common/Chip.vue';
import { computed, onUpdated, ref, shallowReactive, shallowRef, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQueryHash } from '@/utils/use/useQueryHash.js';
import { dealOptions } from '@/const/options/deal.options.js';
import { objectOptions } from '@/const/options/object.options.js';
import { ActivePassiveFUCK, filtersAliases, GateTypeList, YesNo } from '@/const/const.js';
import { defaultsOptions } from '@/const/options/options.js';
import { floorOptions } from '@/const/options/floor.options.js';
import { locationOptions } from '@/const/options/location.options.js';
import { useTableContent } from '@/composables/useTableContent.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { tryOnMounted } from '@vueuse/core';

const yandexMapStyles = shallowReactive({
    width: '100%',
    height: '100vh'
});

const route = useRoute();
const router = useRouter();
const store = useStore();
const { setHash, confirmHash, confirmTransformedHash } = useQueryHash('offers-map');
const { consultantsOptions } = useConsultantsOptions();

const searchEl = useTemplateRef('searchEl');

const isLoading = shallowRef(false);
const searchingIsVisible = shallowRef(false);
const counts = shallowReactive({
    objects: 0,
    offers: 0
});
const offers = ref([]);

const polygonCoordinates = computed(() => {
    if (route.query.polygon && Array.isArray(route.query.polygon)) {
        return route.query.polygon.map(element => element.split(','));
    }

    return [];
});

const selectedFilterList = computed(() => {
    const filters = [];
    const query = { ...route.query };

    delete query.region_neardy;
    delete query.all;
    delete query.page;
    delete query.outside_mkad;

    for (const key in query) {
        const value = query[key];

        if (key === 'region') {
            filters.push(humanizeFilter(key, query.fakeRegion));
        } else if (
            value !== null &&
            value !== '' &&
            key !== 'fakeRegion' &&
            !(Array.isArray(value) && value.length === 0)
        ) {
            filters.push(humanizeFilter(key, value));
        }
    }

    return filters;
});

const gettersForFilters = {
    rangeMinElectricity: value => value + ' кВт',
    rangeMaxDistanceFromMKAD: value => value + ' км',
    deal_type: value => dealOptions.type[Number(value) + 1].toUpperCase(),
    agent_id: value => {
        if (!consultantsOptions.value.length) return null;

        const consultantIndex = consultantsOptions.value.findIndex(
            element => (element.value = value)
        );

        if (consultantIndex !== -1) return consultantsOptions.value[consultantIndex].label;

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

const humanizeFilter = (key, value) => {
    const option = {
        value: key
    };

    const label = filtersAliases[key] ?? null;
    const _value = Object.hasOwn(gettersForFilters, key) ? gettersForFilters[key](value) : null;

    if (!label && !_value) {
        option.label = 'undefined';
    } else {
        option.label = [label, _value].filter(el => el !== null).join(' ');
    }

    return option;
};

const filterByPolygon = async polygon => {
    const query = { ...route.query, polygon };
    await router.replace({ query });
};

const onRemovePolygonFromFilters = () => {
    const query = { ...route.query };

    if (query.polygon) {
        delete query.polygon;
        router.replace({ query });
    }
};

const fetchCounts = async (query, hash) => {
    const offersCount = await api.offers.searchCount(query);

    if (confirmTransformedHash(hash)) {
        counts.offers = Number(offersCount);
    }
};

const fetchOffers = async (withLoader = true) => {
    isLoading.value = withLoader;

    const query = {
        ...route.query,
        type_id: [2, 3],
        fields: 'latitude,longitude,address,complex_id,status,thumb,test_only,id',
        objectsOnly: 1,
        page: 1,
        noWith: 1,
        'per-page': 0
    };

    delete query.page;
    delete query.sort;

    if (query.favorites) {
        await store.dispatch('SEARCH_FAVORITES_OFFERS');
        query.original_id = store.getters.FAVORITES_OFFERS.map(element => element.original_id);
    }

    if (confirmHash(query)) return;

    if (query.favorites) {
        if (!store.getters.FAVORITES_OFFERS.length) await store.dispatch('SEARCH_FAVORITES_OFFERS');

        query.original_id = [];
        query.object_id = [];
        query.complex_id = [];

        store.getters.FAVORITES_OFFERS.forEach(element => {
            query.original_id.push(element.original_id);
            query.object_id.push(element.object_id);
            query.complex_id.push(element.complex_id);
        });
    }

    const currentHash = setHash(query);

    const response = await api.offers.searchMap(query);

    if (Array.isArray(response.data)) {
        offers.value = response.data;
        counts.objects = response.pagination.totalCount;

        delete query.objectsOnly;
        fetchCounts(query, currentHash);
    }

    isLoading.value = false;
    return response;
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

// const deleteFavoriteOffer = async () => {
//     const hasFavoritesFilter = route.query.favorites;
//
//     if (hasFavoritesFilter) {
//         store.dispatch('SEARCH_FAVORITES_OFFERS');
//         fetchOffers(false);
//     }
// };

useTableContent(fetchOffers, {
    initQuery: () => {}
});

const setYandexMapSize = () => {
    yandexMapStyles.height =
        window.innerHeight - searchEl.value.getClientRects()[0].height - 105 + 'px';
};

onUpdated(() => {
    setYandexMapSize();
});

tryOnMounted(() => {
    setYandexMapSize();
});
</script>
