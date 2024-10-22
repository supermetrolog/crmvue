<template>
    <Form class="row">
        <div class="col-12 col-md-6">
            <Input
                v-model="querySearch"
                label="Поиск"
                placeholder="ID, адрес, собственник, телефон, ФИО"
                class="main-input"
            />
        </div>
        <div class="col-12 col-md-2 align-self-end">
            <div class="offer-search__actions">
                <Button @click="$emit('open-filters')" icon :badge="filterCount || false">
                    <i class="icon fa-solid fa-sliders"></i>
                </Button>
                <div>
                    <ButtonLink
                        icon
                        :to="
                            router.resolve({
                                name: isMap ? 'OffersMain' : 'OffersMap',
                                query: route.query
                            }).href
                        "
                    >
                        <i v-if="isMap" class="icon fa-solid fa-list-ul"></i>
                        <i v-else class="icon fa-solid fa-map-location-dot"></i>
                        <span>
                            {{ isMap ? 'Списком' : 'На карте' }}
                            <span v-if="isMap">{{ offersCount }} ({{ objectsCount }})</span>
                            <span v-else>({{ offersCount ?? objectsCount }})</span>
                        </span>
                    </ButtonLink>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="offer-search__functions flex-wrap">
                <Button @click="toggleFavorites" icon warning small>
                    <i class="fa-solid fa-star"></i>
                    <span>Избранные</span>
                </Button>
                <!--                <Button icon success small>-->
                <!--                    <i class="fa-solid fa-heart"></i>-->
                <!--                    <span>Сохранить поиск</span>-->
                <!--                </Button>-->
                <Button @click="resetForm" :disabled="!filterCount" icon small>
                    <i class="fa-solid fa-circle-xmark"></i>
                    <span>Сбросить фильтры</span>
                </Button>
            </div>
        </div>
    </Form>
</template>

<script setup>
import Button from '@/components/common/Button.vue';
import ButtonLink from '@/components/common/ButtonLink.vue';
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import { waitHash } from '@/utils/index.js';
import { useDebounceFn } from '@vueuse/core';
import { deleteEmptyFields } from '@/utils/deleteEmptyFields.js';
import { toCleanObject } from '@/utils/toCleanObjects.js';
import { useQuerySearch } from '@/composables/useQuerySearch.js';

defineEmits(['open-filters']);
defineProps({
    offersCount: {
        type: Number,
        default: 0
    },
    objectsCount: {
        type: Number,
        default: 0
    },
    isMap: {
        type: Boolean,
        default: false
    }
});

const defaultForm = {
    favorites: null
};

const filterAttrs = {
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
    is_fake: null,
    racks: null,
    railway: null,
    has_cranes: null,
    floor_types: [],
    purposes: [],
    object_type: [],
    region: [],
    fakeRegion: null,
    direction: [],
    district_moscow: [],
    status: null,
    firstFloorOnly: null,
    ad_realtor: null,
    ad_cian: null,
    ad_yandex: null,
    ad_free: null,
    ad_avito: null,
    favorites: null,
    outside_mkad: null,
    region_neardy: null,
    polygon: null
};

const route = useRoute();
const router = useRouter();

const form = reactive({});
const { querySearch } = useQuerySearch();

const filterCount = computed(() => {
    let count = 0;

    const query = { ...route.query };

    for (const key in query) {
        if (!Object.hasOwn(filterAttrs, key)) continue;

        const value = query[key];

        if (
            value !== null &&
            value !== '' &&
            key !== 'fakeRegion' &&
            key !== 'region_neardy' &&
            key !== 'outside_mkad'
        ) {
            if (Array.isArray(value)) {
                if (value.length) count++;
            } else {
                count++;
            }
        }
    }

    return count;
});

const queryToForm = () => {
    const query = { ...route.query };
    const cleanedQuery = toCleanObject(query);

    Object.keys(defaultForm).forEach(key => {
        form[key] = cleanedQuery[key] ?? defaultForm[key];
    });
};

watch(
    () => route.query,
    (newQuery, oldQuery) => {
        if (oldQuery == null) queryToForm();
        else {
            const _newQuery = { ...newQuery };

            delete _newQuery.page;
            delete oldQuery.page;

            if (waitHash(_newQuery) !== waitHash(oldQuery)) {
                queryToForm();
            }
        }
    },
    { immediate: true }
);

watch(
    () => form,
    () => {
        debouncedOnSubmit();
    },
    { deep: true }
);

const toDefaultForm = () => {
    querySearch.value = null;
    Object.keys(filterAttrs).forEach(key => {
        form[key] = filterAttrs[key];
    });
};

const resetForm = () => {
    toDefaultForm();
};

const toggleFavorites = () => {
    form.favorites = form.favorites ? null : 1;
};

const onSubmit = async () => {
    const query = { ...route.query, ...form };

    deleteEmptyFields(query);
    await router.replace({ query });
};

const debouncedOnSubmit = useDebounceFn(onSubmit, 500);
</script>
