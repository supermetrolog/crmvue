<template>
    <Tabs :options="{ useUrlFragment: false }" closed>
        <Tab v-if="dealType.id === 3" :name="`Услуги (${servicesLength})`">
            <div v-if="services.length" class="offer-tabs__body">
                <ComplexServices :services="services" />
            </div>
        </Tab>
        <Tab name="Сводка">
            <div class="offer-tabs__body">
                <ComplexOfferSummary :offer="offer" />
            </div>
        </Tab>
        <Tab :name="`Блоки (${offer.parts.length})`">
            <div class="offer-tabs__body">
                <ComplexOfferParts v-if="floors.length" :floors="floors" />
                <EmptyData v-else>Информация о блоках была удалена...</EmptyData>
            </div>
        </Tab>
        <Tab name="Подробно">
            <div class="offer-tabs__body">
                <ComplexOfferDetails
                    v-if="floors.length"
                    :floors="floors"
                    class="offers-tabs__offer-details"
                />
                <EmptyData v-else>Информация о блоках была удалена...</EmptyData>
            </div>
        </Tab>
        <Tab name="Описание">
            <div class="offer-tabs__body">
                <p v-if="offer.description && offer.description.length">
                    {{ offer.description }}
                </p>
                <EmptyData v-else>Описание отсутсвует..</EmptyData>
            </div>
        </Tab>
        <Tab :name="`Фотографии (${photos.length})`">
            <Button
                v-if="photos.length"
                @click="openDownloader(photos, `Объект-${offer.object_id}-ТП-${offer.id}`)"
                class="offer-tabs__button"
            >
                Скачать фотографии
            </Button>
            <div class="offer-tabs__body">
                <Carousel
                    v-if="photos.length"
                    :title="`Предложение #${offer.object_id}-${offer.id}`"
                    :slides="photos"
                    grid
                />
                <EmptyData v-else>Список фотографий пуст.</EmptyData>
            </div>
        </Tab>
        <Tab name="Клиенты">
            <div class="offer-tabs__body">В разработке...</div>
        </Tab>
        <Tab name="Задачи">
            <div class="offer-tabs__body">В разработке...</div>
        </Tab>
        <Tab name="Параметры сделки">
            <div class="offer-tabs__body">В разработке...</div>
        </Tab>
    </Tabs>
</template>

<script setup>
import Carousel from '@/components/common/Carousel.vue';
import ComplexOfferSummary from '@/components/Complex/Offer/ComplexOfferSummary.vue';
import ComplexOfferDetails from '@/components/Complex/Offer/ComplexOfferDetails.vue';
import ComplexOfferParts from '@/components/Complex/Offer/ComplexOfferParts.vue';
import ComplexServices from '@/components/Complex/ComplexServices.vue';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import { getLinkFile } from '@/utils/url.js';
import { isArray } from '@/utils/helpers/array/isArray';

const store = useStore();

const dealFloors = inject('dealFloors');
const dealType = inject('dealType');
const openDownloader = inject('openDownloader');

const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const services = computed(() => {
    return store.getters['Complex/getDealServicesById'](props.offer.offer_id);
});
const servicesLength = computed(() => {
    return services.value.reduce((acc, category) => acc + category.properties.length, 0);
});

const photos = computed(() => {
    if (isArray(props.offer.photos)) {
        return props.offer.photos.map(el => ({
            src: getLinkFile(el)
        }));
    }

    return [];
});

const floors = computed(() => {
    return [...dealFloors].map(floor => ({
        ...floor,
        parts: [...floor.parts].map(part => ({
            ...part,
            active: props.offer.parts.includes(part.id)
        }))
    }));
});
</script>
