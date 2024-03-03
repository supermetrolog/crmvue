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
            <Button v-if="photos.length" @click="openDownloader(photos)" class="offer-tabs__button">
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

<script>
import Carousel from '@/components/common/Carousel.vue';
import ComplexOfferSummary from '@/components/Complex/Offer/ComplexOfferSummary.vue';
import ComplexOfferDetails from '@/components/Complex/Offer/ComplexOfferDetails.vue';
import ComplexOfferParts from '@/components/Complex/Offer/ComplexOfferParts.vue';
import ComplexServices from '@/components/Complex/ComplexServices.vue';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'ComplexTabs',
    components: {
        EmptyData,
        Button,
        ComplexServices,
        ComplexOfferParts,
        ComplexOfferDetails,
        ComplexOfferSummary,
        Carousel
    },
    inject: { dealFloors: 'dealFloors', dealType: 'dealType', openDownloader: 'openDownloader' },
    props: {
        offer: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    computed: {
        photos() {
            return this.offer.photos
                ? this.offer.photos.map(el => ({
                      src: this.$url.api.objects() + el
                  }))
                : [];
        },
        floors() {
            return [...this.dealFloors].map(floor => ({
                ...floor,
                parts: [...floor.parts].map(part => ({
                    ...part,
                    active: this.offer.parts.includes(part.id)
                }))
            }));
        },
        services() {
            return this.$store.getters['Complex/getDealServicesById'](this.offer.offer_id);
        },
        servicesLength() {
            return this.services.reduce((acc, category) => acc + category.properties.length, 0);
        }
    }
};
</script>
