<template>
    <AnimationTransition :speed="0.5" :animation="{ enter: 'slideInLeft', leave: 'slideOutLeft' }">
        <div v-if="offers.length" class="object-view scroller">
            <HoverActionsButton @click="close" label="Закрыть панель" class="object-view__close">
                <i class="fas fa-times"></i>
            </HoverActionsButton>
            <Spinner v-if="isLoading" />
            <div v-else>
                <DashboardChip class="dashboard-bg-gray-l w-100 text-center mb-2">
                    Предложений: {{ offers.length }}
                </DashboardChip>
                <div class="row no-gutters">
                    <CompanyObjectItemOfferOnly
                        v-for="offer in offers"
                        :key="offer.id"
                        :offer="offer"
                        class="col-12"
                    />
                </div>
            </div>
        </div>
    </AnimationTransition>
</template>

<script>
import { mapActions } from 'vuex';
import CompanyObjectItemOfferOnly from '@/components/Company/Object/CompanyObjectItemOfferOnly.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Spinner from '@/components/common/Spinner.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'OfferObject',
    components: {
        HoverActionsButton,
        DashboardChip,
        Spinner,
        AnimationTransition,
        CompanyObjectItemOfferOnly
    },
    props: {
        offerIds: {
            type: Array,
            default: () => []
        }
    },
    setup() {
        const { isLoading } = useDelayedLoader();
        return { isLoading };
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
        close() {
            this.offers = [];
        },
        async fetchOffers() {
            this.isLoading = true;

            if (!this.offerIds.length) return;

            const { data: offers } = await this.SEARCH_OFFERS({
                query: {
                    id: this.offerIds
                }
            });

            const query = {
                object_id: offers.map(el => el.object_id),
                expand: 'generalOffersMix,contact.emails,contact.phones,object,company.mainContact.phones,company.mainContact.emails,offer,consultant.userProfile'
            };

            const { data: allOffers } = await this.SEARCH_OFFERS({ query });
            this.offers = allOffers;

            this.isLoading = false;
        }
    }
};
</script>
