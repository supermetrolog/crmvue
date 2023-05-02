<template>
<div class="object-view">
	<p v-for="offer in offers" :key="offer.id">{{offer.address}}</p>
</div>
</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "ObjectView",
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
            const query = {
                id: this.offerIds,
                expand:
                    "contact.emails,contact.phones,object,company.mainContact.phones,company.mainContact.emails,offer,consultant.userProfile",
			};
            const { data: offers } = await this.SEARCH_OFFERS({ query });
            this.offers = offers;
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