<template>
    <div class="offer-table-mobile-view row">
        <Loader v-if="loader" />
        <OfferMobileItem
            v-for="offer in offers"
            :key="offer.id"
            @favorite-deleted="$emit('favorite-deleted')"
            :offer="offer"
            class="col-12 col-sm-6 col-lg-4 col-xxl-3"
        />
    </div>
</template>

<script>
import Loader from '@/components/common/Loader.vue';
import OfferMobileItem from '@/components/Offer/OfferTableMobileItem.vue';

export default {
    name: 'OfferTableMobile',
    components: {
        OfferMobileItem,
        Loader
    },
    emits: ['favorite-deleted'],
    props: {
        offers: {
            type: Array
        },
        loader: {
            type: Boolean,
            default: false
        },
        sortable: {
            type: Boolean,
            default: true
        }
    }
};
</script>
