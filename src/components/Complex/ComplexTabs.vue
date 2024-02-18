<template>
    <Tabs :options="{ useUrlFragment: false }" closed>
        <Tab v-if="dealType.id === 3" :name="`Услуги (${servicesLength})`">
            <div v-if="services.length" class="offer-tabs__body">
                <ComplexOfferServices :services="services" />
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
                <p v-else>Информация о блоках была удалена...</p>
            </div>
        </Tab>
        <Tab name="Подробно">
            <div class="offer-tabs__body">
                <ComplexOfferDetails
                    v-if="floors.length"
                    :floors="floors"
                    class="offers-tabs__offer-details"
                />
                <p v-else>Информация о блоках была удалена...</p>
            </div>
        </Tab>
        <Tab name="Описание">
            <div class="offer-tabs__body">
                <p v-if="offer.description && offer.description.length">
                    {{ offer.description }}
                </p>
                <p v-else>Описание отсутсвует..</p>
            </div>
        </Tab>
        <Tab :name="`Фотографии (${photos.length})`">
            <div class="offer-tabs__body">
                <Carousel v-if="photos.length" :slides="photos" grid />
                <p v-else>Список фотографий пуст.</p>
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
import ComplexOfferServices from '@/components/Complex/Offer/ComplexOfferServices.vue';

export default {
    name: 'ComplexTabs',
    components: {
        ComplexOfferServices,
        ComplexOfferParts,
        ComplexOfferDetails,
        ComplexOfferSummary,
        Carousel
    },
    inject: { dealFloors: 'dealFloors', dealType: 'dealType' },
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
                      src: this.$apiUrlHelper.objectsUrl() + el
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
