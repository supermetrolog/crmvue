<template>
    <div class="complex-deal-table">
        <p class="complex-deal-table__name">Сводка по ценам</p>
        <div v-if="dealTypeName" class="complex-deal-table__options">
            <ComplexDealPriceFormatter
                @change-format="setPriceOption"
                :deal-type="dealTypeName"
                :price-option="priceOption"
            />
        </div>
        <ComplexDealPriceSale
            v-if="isSaleDeal"
            @set-price-option="setPriceOption"
            :price-option="priceOption"
            :deal="deal"
        />
        <ComplexDealPriceStorage
            v-else-if="isStorageDeal"
            @set-price-option="setPriceOption"
            :price-option="priceOption"
            :deal="deal.summaryBlock"
        />
        <ComplexDealPriceRent
            v-else
            @set-price-option="setPriceOption"
            :price-option="priceOption"
            :deal="deal.summaryBlock"
        />
    </div>
</template>
<script setup>
import ComplexDealPriceSale from '@/components/Complex/Deal/Price/ComplexDealPriceSale.vue';
import { entityOptions } from '@/const/options/options';
import ComplexDealPriceRent from '@/components/Complex/Deal/Price/ComplexDealPriceRent.vue';
import { PriceOptionList, PriceOptionTypes } from '@/const/const';
import ComplexDealPriceStorage from '@/components/Complex/Deal/Price/ComplexDealPriceStorage.vue';
import ComplexDealPriceFormatter from '@/components/Complex/Deal/Price/ComplexDealPriceFormatter.vue';
import { computed, shallowRef } from 'vue';

const props = defineProps({
    deal: {
        type: Object,
        required: true
    }
});

let priceOption = shallowRef(PriceOptionList[PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR]);

const isSaleDeal = computed(() => props.deal.deal_type === entityOptions.deal.typeStatement.SALE);
const isStorageDeal = computed(
    () => props.deal.deal_type === entityOptions.deal.typeStatement.STORAGE
);
const dealTypeName = computed(
    () => [null, 'rent', 'sale', 'storage', 'rent'][props.deal.deal_type]
);

const setPriceOption = id => {
    if (priceOption.value.id !== id) {
        priceOption.value = {
            ...PriceOptionList[id]
        };
    }
};

if (props.deal.deal_type === entityOptions.deal.typeStatement.SALE) {
    priceOption.value = { ...PriceOptionList[PriceOptionTypes.RUB_PER_SQUARE_METERS] };
} else if (props.deal.deal_type === entityOptions.deal.typeStatement.STORAGE) {
    priceOption.value = {
        ...PriceOptionList[PriceOptionTypes.RUB_PER_PALLET_PLACE_PER_DAY]
    };
}
</script>
