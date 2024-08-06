<template>
    <div>
        <p class="offer-table-item-mobile__address-block">
            <span v-if="offer.region_name" class="font-weight-bold">
                {{ $formatter.text().ucFirst(offer.region_name) }}
            </span>
            <span v-if="offer.district_name">{{ offer.district_name }}</span>
            <span v-if="offer.district_moscow_name">{{ offer.district_moscow_name }}</span>
            <span v-if="offer.direction_name">{{ offer.direction_name }}</span>
            <span v-if="offer.town_name">{{ offer.town_name }}</span>
            <span v-if="offer.highway_name">{{ offer.highway_name }} шоссе</span>
            <span v-if="offer.highway_moscow_name">{{ offer.highway_moscow_name }} шоссе</span>
        </p>
        <hr />
        <p v-if="offer.address">
            {{ offer.address }}
        </p>
    </div>
</template>

<script>
export default {
    name: 'OfferTableItemMobileAddress',
    props: {
        offer: {
            type: Object,
            required: true
        }
    }
};
</script>
