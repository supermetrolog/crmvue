<template>
    <OfferTableMap
        @select-polygon="selectPolygon"
        @clear-polygon="clearPolygon"
        :objects="offers"
        :polygon
        :count
        :center
        :zoom
        :loading="isLoading"
    />
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/api';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { LngLat } from '@yandex/ymaps3-types';
import { ObjectMapMarker } from '@/components/ObjectMapPopup/ObjectMapPopup.vue';
import OfferTableMap from '@/components/Offer/OfferTableMap.vue';

const route = useRoute();

const props = defineProps<{
    currentFolder?: number;
    center?: LngLat;
    zoom?: number;
}>();

const isLoading = ref(false);

const offers = shallowRef<ObjectMapMarker[]>([]);
const count = ref<number | undefined>();

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

const fetchOffers = useDebounceFn(async () => {
    isLoading.value = true;

    const query = {
        status: 3,
        ...route.query,
        type_id: [2, 3],
        fields: 'latitude,longitude,address,complex_id,status,test_only,id,area_building,object_id,original_id,is_land,object_type,visual_id,class,offer_state',
        objectsOnly: 1,
        noWith: 1,
        'per-page': 0
    };

    delete query.page;
    delete query.sort;

    singleToArrayByKeys(query, formKeysOnlyArray);

    if (isNotNullish(props.currentFolder)) {
        query.folder_ids = [props.currentFolder];
    }

    if (query.polygon) {
        query.polygon = query.polygon.join(',');
    }

    const response = await api.offers.searchMap(query);

    if (Array.isArray(response.data)) {
        offers.value = response.data;
        count.value = response.pagination?.totalCount;
    }

    isLoading.value = false;
}, 100);

const preparedQuery = computed(() => {
    const q = { ...route.query };

    delete q.page;
    delete q.sort;

    if (props.currentFolder) {
        q.folder_ids = [props.currentFolder];
    }

    return JSON.stringify(q);
});

watch(preparedQuery, () => fetchOffers());

onMounted(fetchOffers);

const polygon = computed(() => {
    if (route.query.polygon && Array.isArray(route.query.polygon)) {
        return route.query.polygon.map(element => element.split(','));
    }

    return [];
});

const router = useRouter();

function selectPolygon(polygon: LngLat[]) {
    const query = { ...route.query, polygon };

    router.replace({ query });
}

function clearPolygon() {
    const query = { ...route.query };

    if (query.polygon) {
        delete query.polygon;

        router.replace({ query });
    }
}
</script>
