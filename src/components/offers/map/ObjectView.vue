<template>
<div class="object-view">
	<CompanyObjectItemOfferOnly
		v-for="offer in offers"
		:key="offer.id"
		:offer="offer"
	/>
</div>
</template>

<script>
import {mapActions} from "vuex";
import CompanyObjectItemOfferOnly from "@/components/companies/objects/company-objects/CompanyObjectItemOfferOnly.vue";

export default {
    name: "ObjectView",
    components: {CompanyObjectItemOfferOnly},
	data() {
        return {
            offers: [],
		}
	},
	props: {
        offerIds: {
            type: Array,
			default: () => []
		}
	},
	methods: {
        ...mapActions(["SEARCH_OFFERS"]),
		async fetchOffers() {
            if (!this.offerIds.length) {
                return;
			}
            
            let query = {
                id: this.offerIds,
			};
            
            const { data: offers } = await this.SEARCH_OFFERS({ query });
            
            query = {
                object_id: offers.map(el => el.object_id),
                expand: "contact.emails,contact.phones,object,company.mainContact.phones,company.mainContact.emails,offer,consultant.userProfile"
            };

            const { data: allOffers } = await this.SEARCH_OFFERS({ query });
            this.offers = allOffers;
		}
	},
	watch: {
        offerIds() {
            this.fetchOffers();
		}
	}
}
</script>

<style scoped>

</style>