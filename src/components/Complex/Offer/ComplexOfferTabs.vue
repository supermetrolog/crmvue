<template>
    <div class="trade-offer-tabs">
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
                        :area="tradeOffer.area"
                        :price="tradeOffer.price"
                        :id="tradeOffer.id"
                        :lastUpdate="tradeOffer.lastUpdate"
                        :status="tradeOffer.status"
                        :parameters="tradeOffer.parameters"
                    />
                </div>
            </Tab>
            <Tab :name="archiveTradeOffersTitle">
                <div
                    class="trade-offer-tabs__tab-body trade-offer-tabs__tab-body_opacity"
                >
                    <ComplexOfferItem
                        v-for="tradeOffer in archiveOffers"
                        :key="tradeOffer.id"
                        :area="tradeOffer.area"
                        :price="tradeOffer.price"
                        :id="tradeOffer.id"
                        :lastUpdate="tradeOffer.lastUpdate"
                        :status="tradeOffer.status"
                        :parameters="tradeOffer.parameters"
                    />
                </div>
            </Tab>
        </Tabs>
    </div>
</template>

<script>
import data from "./data";
import ComplexOfferItem from "@/components/Complex/Offer/ComplexOfferItem.vue";
export default {
    name: "ComplexOfferTabs",
    props: {},
    components: {
        ComplexOfferItem

    },
    data() {
        return {
            tradeOffers: data,
        };
    },
    computed: {
        activeOffers() {
            return this.tradeOffers.filter((offer) => offer.active);
        },
        archiveOffers() {
            return this.tradeOffers.filter((offer) => !offer.active);
        },
        activeTradeOffersTitle() {
            return `Активных ТП (${this.activeOffers.length} шт.)`;
        },
        archiveTradeOffersTitle() {
            return `Архив (${this.archiveOffers.length}  шт.)`;
        },
    },
};
</script>
