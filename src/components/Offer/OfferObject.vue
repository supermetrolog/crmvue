<template>
    <div v-if="offers.length" class="object-view scroller">
        <div class="control-panel">
            Предложений: {{ offers.length }}
            <i @click="clickCloseHandler" class="fas fa-times"></i>
        </div>
        <div class="row no-gutters">
            <CompanyObjectItemOfferOnly
                v-for="offer in offers"
                :key="offer.id"
                :offer="offer"
                class="col-12"
            />
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import CompanyObjectItemOfferOnly from '@/components/Company/Object/CompanyObjectItemOfferOnly.vue';

export default {
    name: 'OfferObject',
    components: { CompanyObjectItemOfferOnly },
    props: {
        offerIds: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            offers: []
        };
    },
    watch: {
        offerIds() {
            this.fetchOffers();
        }
    },
    methods: {
        ...mapActions(['SEARCH_OFFERS']),
        clickCloseHandler() {
            this.offers = [];
        },
        async fetchOffers() {
            if (!this.offerIds.length) {
                return;
            }

            let query = {
                id: this.offerIds
            };

            const { data: offers } = await this.SEARCH_OFFERS({ query });

            query = {
                object_id: offers.map(el => el.object_id),
                expand: 'generalOffersMix,contact.emails,contact.phones,object,company.mainContact.phones,company.mainContact.emails,offer,consultant.userProfile'
            };

            const { data: allOffers } = await this.SEARCH_OFFERS({ query });
            this.offers = allOffers;
        }
    }
};
</script>

<style scoped lang="scss">
.object-view {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #f7f7f7;
    padding: 1rem 1.5rem 1.5rem;
    width: 400px;
}

.control-panel {
    position: relative;
    padding: 0 0.5rem;
}

.control-panel i {
    position: absolute;
    top: 2px;
    right: -15px;
    font-size: 24px;
    cursor: pointer;
}
</style>
