<template>
    <div class="trade-offer-tabs">
        <p class="trade-offer-tabs__title">Торговые предложения</p>
        <Tabs
            :options="{ useUrlFragment: false }"
            nav-class="trade-offer-tabs__list"
            nav-item-link-class="trade-offer-tabs__link"
        >
            <Tab :name="activeTradeOffersTitle">
                <div class="trade-offer-tabs__tab-body">
                    <ComplexOfferItem
                        v-for="tradeOffer in activeOffers"
                        :key="tradeOffer.id"
                        :trade-offer="tradeOffer"
                    />
                </div>
                <p v-if="!activeOffers.length">Список активных торговых предложений пуст.</p>
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
                <div class="trade-offer-tabs__tab-body trade-offer-tabs__tab-body_opacity">
                    <ComplexOfferItem
                        v-for="tradeOffer in archiveOffers"
                        :key="tradeOffer.id"
                        :trade-offer="tradeOffer"
                    />
                </div>
                <p v-if="!archiveOffers.length">Список архивных торговых предложений пуст.</p>
            </Tab>
        </Tabs>
    </div>
</template>

<script>
import ComplexOfferItem from '@/components/Complex/Offer/ComplexOfferItem.vue';

export default {
    name: 'ComplexOfferTabs',
    components: {
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
