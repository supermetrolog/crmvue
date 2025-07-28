<template>
    <Tabs :options="{ useUrlFragment: false }" closed>
        <Tab v-if="isStorageDealType" :name="`Услуги (${servicesLength})`">
            <div v-if="services.length" class="offer-tabs__body">
                <ComplexServices :services="services" />
            </div>
        </Tab>
        <Tab name="Сводка">
            <div class="offer-tabs__body">
                <ComplexDealSummary v-if="hasActiveOffers" :summary="deal.summaryBlock" />
                <EmptyData v-else>Информация отсутсвует..</EmptyData>
            </div>
        </Tab>
        <Tab name="Подробно">
            <div class="offer-tabs__body">
                <ComplexOfferDetails
                    v-if="hasActiveOffers"
                    :floors="floors"
                    class="offers-tabs__offer-details"
                />
                <EmptyData v-else>Информация о блоках отсутствует...</EmptyData>
            </div>
        </Tab>
        <Tab name="Описание">
            <div class="offer-tabs__body">
                <div
                    v-if="deal.description && deal.description.length"
                    v-html="deal.description"
                ></div>
                <EmptyData v-else>Описание отсутсвует..</EmptyData>
            </div>
        </Tab>
        <Tab :name="`Фотографии (${hasActiveOffers ? photos.length : 0})`">
            <div v-if="hasActiveOffers && photos.length" class="offer-tabs__content">
                <Button
                    @click="openDownloader(photos, `Объект-${deal.object_id}-Сделка-${deal.id}`)"
                    class="offer-tabs__button"
                >
                    Скачать фотографии
                </Button>
                <div class="offer-tabs__body">
                    <Carousel
                        :title="`Сделка #${deal.object_id}-${deal.id}`"
                        :slides="photos"
                        grid
                    />
                </div>
            </div>
            <EmptyData v-else>Список фотографий пуст..</EmptyData>
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
import { entityOptions } from '@/const/options/options';
import ComplexServices from '@/components/Complex/ComplexServices.vue';
import ComplexOfferDetails from '@/components/Complex/Offer/ComplexOfferDetails.vue';
import ComplexDealSummary from '@/components/Complex/Deal/ComplexDealSummary.vue';
import Carousel from '@/components/common/Carousel.vue';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import Tab from '@/components/common/Tabs/Tab.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import { getLinkFile } from '@/utils/url.js';

const store = useStore();

const props = defineProps({
    deal: {
        type: Object,
        required: true
    },
    hasActiveOffers: {
        type: Boolean,
        default: false
    },
    floors: {
        type: Array,
        default: () => []
    }
});

const openDownloader = inject('openDownloader');

const photos = computed(() => {
    if (!props.deal.summaryBlock) return [];

    const photos =
        props.deal.summaryBlock.photos instanceof Array
            ? props.deal.summaryBlock.photos
            : Object.values(props.deal.summaryBlock.photos);

    return photos.map(el => ({
        src: getLinkFile(el)
    }));
});

const services = computed(() => store.getters['Complex/getDealServicesById'](props.deal.id));
const servicesLength = computed(() =>
    services.value.reduce((acc, category) => acc + category.properties.length, 0)
);
const isStorageDealType = computed(
    () => props.deal.deal_type === entityOptions.deal.typeStatement.STORAGE
);
</script>
