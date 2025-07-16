<template>
    <div class="offer-table-item__relations h-100">
        <OfferTableItemRelationSelectElement
            v-if="hasRentOffers"
            @open="$emit('open', $event)"
            :active="currentTab === dealOptions.typeStatement.RENT"
            :type="dealOptions.typeStatement.RENT"
            label="По этому объекту имеются предложения по аренде"
            class="offer-table-item__relation-button--rent"
        >
            Аренда
        </OfferTableItemRelationSelectElement>
        <OfferTableItemRelationSelectElement
            v-if="hasSaleOffers"
            @open="$emit('open', $event)"
            :active="currentTab === dealOptions.typeStatement.SALE"
            :type="dealOptions.typeStatement.SALE"
            label="По этому объекту имеются предложения по продаже"
            class="offer-table-item__relation-button--sale"
        >
            Продажа
        </OfferTableItemRelationSelectElement>
        <OfferTableItemRelationSelectElement
            v-if="hasStorageOffers"
            @open="$emit('open', $event)"
            :active="currentTab === dealOptions.typeStatement.STORAGE"
            :type="dealOptions.typeStatement.STORAGE"
            label="По этому объекту имеются предложения по ответ.хранению"
            class="offer-table-item__relation-button--storage"
        >
            Отв.хран.
        </OfferTableItemRelationSelectElement>
        <OfferTableItemRelationSelectElement
            v-if="hasSubleaseOffers"
            @open="$emit('open', $event)"
            :active="currentTab === dealOptions.typeStatement.SUBLEASE"
            :type="dealOptions.typeStatement.SUBLEASE"
            label="По этому объекту имеются предложения по субаренде"
            class="offer-table-item__relation-button--sublease"
        >
            Субаренда
        </OfferTableItemRelationSelectElement>
    </div>
</template>

<script setup>
import { dealOptions } from '@/const/options/deal.options.js';
import { computed } from 'vue';
import OfferTableItemRelationSelectElement from '@/components/Offer/TableItem/OfferTableItemRelationSelectElement.vue';

defineEmits(['open']);
const props = defineProps({
    offers: {
        type: Array,
        default: () => []
    },
    current: Number,
    currentTab: Number
});

const offerExistByType = (offers, type) => {
    return offers.some(
        element =>
            element.deal_type === type &&
            element.id !== props.current &&
            !element.is_deleted &&
            !element.is_fake &&
            !element.deal_id
    );
};

const hasRentOffers = computed(() =>
    offerExistByType(props.offers, dealOptions.typeStatement.RENT)
);
const hasSaleOffers = computed(() =>
    offerExistByType(props.offers, dealOptions.typeStatement.SALE)
);
const hasStorageOffers = computed(() =>
    offerExistByType(props.offers, dealOptions.typeStatement.STORAGE)
);
const hasSubleaseOffers = computed(() =>
    offerExistByType(props.offers, dealOptions.typeStatement.SUBLEASE)
);
</script>
