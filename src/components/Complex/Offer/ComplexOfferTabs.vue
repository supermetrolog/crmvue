<template>
    <div class="trade-offer-tabs">
        <p class="trade-offer-tabs__title">Торговые предложения</p>
        <Tabs :options="{ useUrlFragment: false }">
            <Tab :name="activeTradeOffersTitle">
                <div v-if="activeOffers.length" class="trade-offer-tabs__tab-body">
                    <ComplexOfferItem
                        v-for="tradeOffer in activeOffers"
                        :key="tradeOffer.id"
                        :trade-offer="tradeOffer"
                    />
                </div>
                <EmptyData v-else>Список активных торговых предложений пуст..</EmptyData>
            </Tab>
            <Tab v-if="completeOffers.length" :name="completeTradeOffersTitle">
                <div class="trade-offer-tabs__tab-body">
                    <ComplexOfferItem
                        v-for="tradeOffer in completeOffers"
                        :key="tradeOffer.id"
                        :trade-offer="tradeOffer"
                        :offer-type="tradeOffer"
                    />
                </div>
            </Tab>
            <Tab :name="archiveTradeOffersTitle">
                <div
                    v-if="archiveOffers.length"
                    class="trade-offer-tabs__tab-body trade-offer-tabs__tab-body_opacity"
                >
                    <ComplexOfferItem
                        v-for="tradeOffer in archiveOffers"
                        :key="tradeOffer.id"
                        :trade-offer="tradeOffer"
                    />
                </div>
                <EmptyData v-else>Список архивных торговых предложений пуст..</EmptyData>
            </Tab>
        </Tabs>
    </div>
</template>

<script>
import ComplexOfferItem from '@/components/Complex/Offer/ComplexOfferItem.vue';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'ComplexOfferTabs',
    components: {
        EmptyData,
        ComplexOfferItem
    },
    props: {
        tradeOffers: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        activeOffers() {
            return this.tradeOffers.filter(offer => !offer.deleted && !offer.deal_id);
        },
        archiveOffers() {
            return this.tradeOffers
                .filter(offer => offer.deleted && !offer.deal_id)
                .sort((first, second) => second.publ_time - first.publ_time);
        },
        completeOffers() {
            return this.tradeOffers.filter(offer => offer.deal_id);
        },
        activeTradeOffersTitle() {
            return `Текущие (${this.activeOffers.length} шт.)`;
        },
        archiveTradeOffersTitle() {
            return `Архив (${this.archiveOffers.length} шт.)`;
        },
        completeTradeOffersTitle() {
            return `Сделки (${this.completeOffers.length} шт.)`;
        }
    }
};
</script>
