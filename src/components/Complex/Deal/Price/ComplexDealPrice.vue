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
<script>
import ComplexDealPriceSale from '@/components/Complex/Deal/Price/ComplexDealPriceSale.vue';
import { entityOptions } from '@/const/options/options';
import ComplexDealPriceRent from '@/components/Complex/Deal/Price/ComplexDealPriceRent.vue';
import { PriceOptionList, PriceOptionTypes } from '@/const/const';
import ComplexDealPriceStorage from '@/components/Complex/Deal/Price/ComplexDealPriceStorage.vue';
import ComplexDealPriceFormatter from '@/components/Complex/Deal/Price/ComplexDealPriceFormatter.vue';

export default {
    name: 'ComplexDealPrice',
    components: {
        ComplexDealPriceFormatter,
        ComplexDealPriceStorage,
        ComplexDealPriceRent,
        ComplexDealPriceSale
    },
    props: {
        deal: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            priceOption: {
                ...PriceOptionList[PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR]
            }
        };
    },
    computed: {
        isSaleDeal() {
            return this.deal.deal_type === entityOptions.deal.typeStatement.SALE;
        },
        isStorageDeal() {
            return this.deal.deal_type === entityOptions.deal.typeStatement.STORAGE;
        },
        dealTypeName() {
            return [null, 'rent', 'sale', 'storage', 'rent'][this.deal.deal_type];
        }
    },
    methods: {
        setPriceOption(id) {
            if (this.priceOption.id !== id) {
                this.priceOption = {
                    ...PriceOptionList[id]
                };
            }
        }
    },
    created() {
        if (this.deal.deal_type === entityOptions.deal.typeStatement.SALE) {
            this.priceOption = { ...PriceOptionList[PriceOptionTypes.RUB_PER_SQUARE_METERS] };
        } else if (this.deal.deal_type === entityOptions.deal.typeStatement.STORAGE) {
            this.priceOption = {
                ...PriceOptionList[PriceOptionTypes.RUB_PER_PALLET_PLACE_PER_DAY]
            };
        }
    }
};
</script>
