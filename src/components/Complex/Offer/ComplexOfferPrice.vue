<template>
    <div class="trade-offer-table">
        <p class="trade-offer-table__subtitle">E - предложения</p>
        <div v-if="dealType.id === 1" class="trade-offer-table__options">
            <button
                @click.prevent="
                    $emit('setPriceOption', PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR)
                "
                class="trade-offer-table__option"
                :class="{
                    active: priceOption.id === PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR
                }"
            >
                м<sup>2</sup>/год
            </button>
            <button
                @click.prevent="
                    $emit('setPriceOption', PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_MONTH)
                "
                class="trade-offer-table__option"
                :class="{
                    active: priceOption.id === PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_MONTH
                }"
            >
                м<sup>2</sup>/месяц
            </button>
        </div>
        <with-unit-type class="trade-offer-table__title" :unit-type="title.unitType">
            {{ $formatter.numberOrRangeNew(titlePrice.valueMin, titlePrice.valueMax) }}
        </with-unit-type>
        <ul class="trade-offer-table__description">
            <li
                v-if="subtitle"
                class="trade-offer-table__grid-title trade-offer-table__grid-title--strong"
            >
                <p class="trade-offer-table__text trade-offer-table__label">
                    {{ subtitle.label }}
                </p>
                <with-unit-type class="trade-offer-table__value" :unit-type="unitType">
                    {{
                        $formatter.numberOrRangeNew(subtitlePrice.valueMin, subtitlePrice.valueMax)
                    }}
                </with-unit-type>
            </li>
            <ComplexOfferPriceTable
                v-if="warehousePrices.length"
                :unit-type="unitType"
                :properties="warehousePrices"
            />
            <ComplexOfferPriceTable
                v-if="rangePrices.length"
                :unit-type="unitType"
                :properties="rangePrices"
            />
            <ComplexOfferPriceTable
                v-if="price.serviceIn.length"
                :unit-type="unitTypes.RUB_PER_PIECE"
                :properties="price.serviceIn"
                without-range
                tooltip
                title="Услуги приемки"
            />
            <ComplexOfferPriceTable
                v-if="price.serviceOut.length"
                :unit-type="unitTypes.RUB_PER_PIECE"
                :properties="price.serviceOut"
                without-range
                tooltip
                title="Услуги отгрузки/комплектовки"
            />
            <ComplexOfferPriceTable
                v-if="servicePrices.length"
                :unit-type="unitTypes.RUB_PER_PIECE"
                :properties="servicePrices"
                without-range
                tooltip
                title="Дополнительные услуги"
            />
        </ul>
    </div>
</template>

<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import ComplexOfferPriceTable from '@/components/Complex/Offer/ComplexOfferPriceTable.vue';
import { DealStatusType, PriceOptionTypes } from '@/const/const';

export default {
    name: 'ComplexOfferPrice',
    components: { ComplexOfferPriceTable, WithUnitType },
    emits: ['setPriceOption'],
    inject: ['dealType'],
    props: {
        title: {
            type: Object,
            required: true
        },
        subtitle: {
            type: Object,
            default: null
        },
        price: {
            type: Object,
            default: () => {}
        },
        titleUnitType: {
            type: String,
            default: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
        },
        unitType: {
            type: String,
            default: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
        },
        priceOption: {
            type: Object,
            default: null
        }
    },
    data() {
        return {};
    },
    computed: {
        PriceOptionTypes() {
            return PriceOptionTypes;
        },
        DealStatusType() {
            return DealStatusType;
        },
        unitTypes() {
            return unitTypes;
        },
        titlePrice() {
            return {
                valueMin: this.priceOption.func
                    ? this.priceOption.func(this.title.valueMin)
                    : this.title.valueMin,
                valueMax: this.priceOption.func
                    ? this.priceOption.func(this.title.valueMax)
                    : this.title.valueMax
            };
        },
        subtitlePrice() {
            return {
                valueMin: this.priceOption.func
                    ? this.priceOption.func(this.subtitle.valueMin)
                    : this.subtitle.valueMin,
                valueMax: this.priceOption.func
                    ? this.priceOption.func(this.subtitle.valueMax)
                    : this.subtitle.valueMax
            };
        },
        rangePrices() {
            if (this.priceOption.func) {
                return this.price.range.map(element => ({
                    ...element,
                    valueMin: this.priceOption.func(element.valueMin),
                    valueMax: this.priceOption.func(element.valueMax)
                }));
            }

            return this.price.range;
        },
        warehousePrices() {
            if (this.priceOption.func) {
                return this.price.warehouse.map(element => ({
                    ...element,
                    valueMin: this.priceOption.func(element.valueMin),
                    valueMax: this.priceOption.func(element.valueMax)
                }));
            }

            return this.price.warehouse;
        },
        servicePrices() {
            if (this.priceOption.func) {
                return this.price.service.map(element => ({
                    ...element,
                    value: this.priceOption.func(element.value)
                }));
            }

            return this.price.service;
        }
    },
    methods: {}
};
</script>
