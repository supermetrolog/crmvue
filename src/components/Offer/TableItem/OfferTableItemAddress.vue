<template>
    <a :href="$url.offerByObject(offer)" target="_blank">
        <p v-if="offer.region_name" class="font-weight-bold">
            {{ offer.region_name }}
        </p>
        <p v-if="offer.district_name">
            {{ offer.district_name }}
        </p>
        <p v-if="offer.district_moscow_name">
            {{ offer.district_moscow_name }}
        </p>
        <p v-if="offer.direction_name">
            {{ offer.direction_name }}
        </p>
        <p v-if="offer.town_name">
            {{ offer.town_name }}
        </p>
        <p v-if="offer.highway_name">{{ offer.highway_name }} шоссе</p>
        <p v-if="offer.highway_moscow_name">{{ offer.highway_moscow_name }} шоссе</p>
        <hr />
        <p v-if="offer.address">
            {{ offer.address }}
        </p>
    </a>
</template>

<script setup>
defineProps({
    offer: {
        type: Object,
        required: true
    }
});
</script>
