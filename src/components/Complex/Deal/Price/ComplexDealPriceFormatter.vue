<template>
    <div v-if="dealType === 'rent'" class="complex-deal-price-formatter">
        <ComplexDealPriceFormatterOption
            @change="$emit('change-format', PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR)"
            :active="priceOption.id === PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
        >
            м<sup>2</sup>/год
        </ComplexDealPriceFormatterOption>
        <ComplexDealPriceFormatterOption
            @change="$emit('change-format', PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_MONTH)"
            :active="priceOption.id === PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_MONTH"
        >
            м<sup>2</sup>/месяц
        </ComplexDealPriceFormatterOption>
    </div>
    <div v-else-if="dealType === 'sale'" class="complex-deal-price-formatter">
        <ComplexDealPriceFormatterOption
            @change="$emit('change-format', PriceOptionTypes.RUB_PER_SQUARE_METERS)"
            :active="priceOption.id === PriceOptionTypes.RUB_PER_SQUARE_METERS"
        >
            ₽ за м<sup>2</sup>
        </ComplexDealPriceFormatterOption>
        <ComplexDealPriceFormatterOption
            @change="$emit('change-format', PriceOptionTypes.RUB_PER_ALL)"
            :active="priceOption.id === PriceOptionTypes.RUB_PER_ALL"
        >
            ₽ за всё
        </ComplexDealPriceFormatterOption>
    </div>
    <div v-else-if="dealType === 'storage'" class="complex-deal-price-formatter">
        <ComplexDealPriceFormatterOption
            @change="$emit('change-format', PriceOptionTypes.RUB_PER_PALLET_PLACE_PER_DAY)"
            :active="priceOption.id === PriceOptionTypes.RUB_PER_PALLET_PLACE_PER_DAY"
        >
            ₽ за п.м
        </ComplexDealPriceFormatterOption>
    </div>
</template>
<script setup>
import { PriceOptionTypes } from '@/const/const';
import ComplexDealPriceFormatterOption from '@/components/Complex/Deal/Price/ComplexDealPriceFormatterOption.vue';

defineEmits(['change-format']);
defineProps({
    priceOption: {
        type: Object,
        required: true
    },
    dealType: {
        type: String,
        default: 'rent'
    }
});
</script>
