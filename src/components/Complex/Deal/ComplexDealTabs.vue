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
                    :floors="deal.floors"
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
                <Button @click="openDownloader(photos)" class="offer-tabs__button">
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

<script>
import { entityOptions } from '@/const/options/options';
import ComplexServices from '@/components/Complex/ComplexServices.vue';
import ComplexOfferDetails from '@/components/Complex/Offer/ComplexOfferDetails.vue';
import ComplexDealSummary from '@/components/Complex/Deal/ComplexDealSummary.vue';
import Carousel from '@/components/common/Carousel.vue';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'ComplexDealTabs',
    components: {
        EmptyData,
        Button,
        Carousel,
        ComplexDealSummary,
        ComplexOfferDetails,
        ComplexServices
    },
    inject: ['openDownloader'],
    props: {
        deal: {
            type: Object,
            required: true
        },
        hasActiveOffers: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    computed: {
        photos() {
            if (!this.deal.summaryBlock) return [];

            const photos =
                this.deal.summaryBlock.photos instanceof Array
                    ? this.deal.summaryBlock.photos
                    : Object.values(this.deal.summaryBlock.photos);

            return photos.map(el => ({
                src: this.$url.api.objects() + el
            }));
        },
        services() {
            return this.$store.getters['Complex/getDealServicesById'](this.deal.id);
        },
        servicesLength() {
            return this.services.reduce((acc, category) => acc + category.properties.length, 0);
        },
        isStorageDealType() {
            return this.deal.deal_type === entityOptions.deal.typeStatement.STORAGE;
        }
    }
};
</script>
