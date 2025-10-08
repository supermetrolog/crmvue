<template>
    <div v-if="activeOffers.length" class="object-map-popup__groups">
        <ObjectMapPopupOffersGroup
            v-if="groups.sale?.length"
            :offers="groups.sale"
            label="Продажа"
        />
        <ObjectMapPopupOffersGroup
            v-if="groups.rent?.length"
            :offers="groups.rent"
            label="Аренда"
        />
        <ObjectMapPopupOffersGroup
            v-if="groups.sublease?.length"
            :offers="groups.sublease"
            label="Субаренда"
        />
        <ObjectMapPopupOffersGroup
            v-if="groups.storage?.length"
            :offers="groups.storage"
            label="Ответ-хранение"
        />
    </div>
    <p v-else class="fs-3 text-grey">Нет активных предложений</p>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ObjectMiniOffer } from '@/components/ObjectMapPopup/types';
import ObjectMapPopupOffersGroup from '@/components/ObjectMapPopup/ObjectMapPopupOffersGroup.vue';

const props = defineProps<{
    offers: ObjectMiniOffer[];
}>();

const activeOffers = computed(() =>
    props.offers.filter(offer => !offer.deleted && offer.status !== 2)
);

const dealTypeNumberToStringMap = {
    1: 'rent',
    2: 'sale',
    3: 'storage',
    4: 'sublease'
} as const;

const groups = computed(() => {
    return Object.groupBy(activeOffers.value, offer => dealTypeNumberToStringMap[offer.deal_type]);
});
</script>
<style lang="scss">
.object-map-popup {
    &__groups {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>
