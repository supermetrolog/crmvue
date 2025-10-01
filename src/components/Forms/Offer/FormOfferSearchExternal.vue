<template>
    <UiForm class="row">
        <div class="col-12 col-md-6">
            <UiInput
                v-model="form.all"
                label="Поиск"
                placeholder="ID, адрес, собственник, телефон, ФИО"
                class="main-input"
            />
        </div>
        <div class="col-12 col-md-6 align-self-end">
            <div class="offer-search__actions">
                <UiButton
                    @click="$emit('open-filters')"
                    :badge="filterCount || undefined"
                    icon="fa-solid fa-sliders"
                    color="light"
                >
                    Фильтры
                </UiButton>
                <UiButton
                    @click="resetForm"
                    :disabled="!filterCount"
                    color="danger-light"
                    icon="fa-solid fa-trash"
                >
                    Очистить фильтры
                </UiButton>
                <UiButton
                    :icon="isMap ? 'fa-solid fa-list-ul' : 'fa-solid fa-map-location-dot'"
                    :to="{
                        name: props.isMap ? 'offers.table' : 'offers.map',
                        query: route.query
                    }"
                    :as="RouterLink"
                    color="light"
                    :loading
                >
                    <span class="mr-1">{{ isMap ? 'Списком' : 'На карте' }}</span>
                    <span v-if="isMap">
                        <span v-if="!loading">
                            ({{ offersCount }} предл. /{{ objectsCount }} объект.)
                        </span>
                    </span>
                    <span v-else>({{ objectsCount ?? offersCount }})</span>
                </UiButton>
            </div>
        </div>
        <div class="col-12">
            <UiButton
                @click="toggleFavorites"
                :color="form.favorites ? 'warning' : 'warning-light'"
                small
                icon="fa-solid fa-star"
            >
                Избранные
            </UiButton>
            <!--                <Button icon success small>-->
            <!--                    <i class="fa-solid fa-heart"></i>-->
            <!--                    <span>Сохранить поиск</span>-->
            <!--                </Button>-->
        </div>
    </UiForm>
</template>

<script setup>
import { computed, onBeforeMount, reactive, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { useDebounceFn } from '@vueuse/core';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';
import { toCleanObject } from '@/utils/helpers/object/toCleanObjects.js';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['open-filters']);
const props = defineProps({
    offersCount: {
        type: Number,
        default: 0
    },
    objectsCount: {
        type: Number,
        default: 0
    },
    isMap: Boolean,
    loading: Boolean
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

watch(() => route.query, queryToForm, { immediate: true });

watch(
    () => form,
    () => {
        debouncedOnSubmit();
    },
    { deep: true }
);

const toDefaultForm = () => {
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

onBeforeMount(() => {
    form.all = route.query.all;
});

const debouncedOnSubmit = useDebounceFn(onSubmit, 500);

// all query search

watch(
    () => route.query.all,
    value => {
        form.all = value;
    }
);
</script>
