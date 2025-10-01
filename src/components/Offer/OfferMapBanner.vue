<template>
    <MapBanner
        :to="{ name: 'offers.map', query }"
        :loading="isLoading"
        :markers="offers"
        :grid-size="128"
        scalable
    >
        <template #label>
            <span v-if="isLoading || !isLoaded">Поиск объектов..</span>
            <span v-else-if="isLoaded">Показать {{ countLabel }} на карте</span>
        </template>
    </MapBanner>
</template>
<script setup lang="ts">
import MapBanner from '@/components/MapBanner/MapBanner.vue';
import { useRoute } from 'vue-router';
import api from '@/api/api';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { plural } from '@/utils/plural';
import { useDebounceFn } from '@vueuse/core';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const route = useRoute();

const props = defineProps<{
    currentFolder?: number;
}>();

const query = computed(() => ({ ...route.query, folder: props.currentFolder }));

const isLoading = ref(false);
const isLoaded = ref(false);

const offers = shallowRef([]);
const count = ref(0);

const countLabel = computed(() => plural(count.value, '%d объект', '%d объекта', '%d объектов'));

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
        ...route.query,
        type_id: [2, 3],
        fields: 'latitude,longitude,address,complex_id,status,thumb,test_only,id',
        objectsOnly: 1,
        page: 1,
        noWith: 1,
        'per-page': 0
    };

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

    isLoaded.value = true;
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
</script>
