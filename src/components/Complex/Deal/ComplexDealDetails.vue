<template>
    <div class="additional-details">
        <p v-if="deal.sale_company" class="additional-details__chip">Готов продать компанию</p>
        <h2 v-tippy="'Система налогооблажения'" class="additional-details__title">
            {{ taxForm }}
        </h2>
        <div v-if="priceOpex.status !== 0" class="additional-details__services">
            <ComplexDealDetailsService
                v-if="priceOpex.status !== 1"
                title="Эксплуатация"
                :service="priceOpex"
            />
            <p v-else class="additional-details__service">
                Эксплуатационные расходы включены в стоимость
            </p>
            <ComplexDealDetailsService
                v-if="priceService.status !== 1"
                title="Коммунальные услуги"
                :service="priceService"
            />
            <p v-else class="additional-details__service">
                Коммунальные услуги включены в стоимость
            </p>
        </div>
        <p class="additional-details__category">Особые условия</p>
        <ul v-if="hasSpecialTerms" class="additional-details__list">
            <li class="additional-details__item">
                <p class="additional-details__label">Каникулы</p>
                <p v-if="deal.holidays" class="additional-details__value">
                    <span>Да, </span>
                    <template v-if="deal.holidays_value_min">
                        <span>
                            {{
                                $formatter.numberOrRangeNew(
                                    deal.holidays_value_min,
                                    deal.holidays_value_max
                                )
                            }}
                        </span>
                        <span> мес.</span>
                    </template>
                </p>
                <p v-else class="additional-details__value">Нет</p>
            </li>
            <li class="additional-details__item">
                <p class="additional-details__label">Депозит</p>
                <p v-if="deal.deposit" class="additional-details__value">
                    <span>Да, </span>
                    <span v-if="deal.deposit_value">{{ deal.deposit_value }} мес.</span>
                </p>
                <p v-else class="additional-details__value">Нет</p>
            </li>
            <li class="additional-details__item">
                <p class="additional-details__label">Залоговый платеж</p>
                <p class="additional-details__value">
                    {{ deal.pledge ? 'Да' : 'Нет' }}
                </p>
            </li>
        </ul>
        <ComplexDealDetailsBusiness
            v-if="hasBusiness"
            class="additional-details__business"
            :properties="businessProperties"
        />
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes.js';
import ComplexDealDetailsBusiness from '@/components/Complex/Deal/ComplexDealDetailsBusiness.vue';
import { entityProperties } from '@/const/properties/properties';
import { entityOptions } from '@/const/options/options';
import ComplexDealDetailsService from '@/components/Complex/Deal/ComplexDealDetailsService.vue';

export default {
    name: 'ComplexDealDetails',
    components: { ComplexDealDetailsService, ComplexDealDetailsBusiness },
    props: {
        deal: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            ucFirstTextFormatter: this.$formatter.text()
        };
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        taxForm() {
            if (this.deal.tax_form) return entityOptions.deal.tax[this.deal.tax_form];
            return null;
        },
        hasBusiness() {
            return this.deal.rent_business === 1;
        },
        businessProperties() {
            return Object.keys(entityProperties.deal.rentBusiness).map(property => ({
                ...entityProperties.deal.rentBusiness[property],
                value: this.deal[property]
            }));
        },
        hasSpecialTerms() {
            return true;
        },
        priceOpex() {
            const priceObject = {
                active: this.deal.price_opex === 1,
                status: this.deal.price_opex,
                label: entityOptions.deal.servicePrice[this.deal.price_opex] || '-',
                name: 'Цена OPEX',
                value: null
            };

            if (this.deal.price_opex === 3) priceObject.value = this.deal.price_opex_value;
            else if (this.deal.price_opex === 2)
                priceObject.items = this.deal.inc_opex.map(option => ({
                    ...entityOptions.deal.opex[option]
                }));

            return priceObject;
        },
        priceService() {
            const priceObject = {
                active: this.deal.public_services === 1,
                status: this.deal.public_services,
                label: entityOptions.deal.servicePrice[this.deal.public_services] || '-',
                name: 'Ком. платеж',
                value: null
            };

            if (this.deal.public_services === 3)
                priceObject.value = this.deal.price_public_services;
            else if (this.deal.public_services === 2)
                priceObject.items = this.deal.inc_services.map(option => ({
                    ...entityOptions.deal.publicServices[option]
                }));

            return priceObject;
        }
    },
    methods: {
        addDotsToLabel(value, maxLen) {
            let res = value;
            while (res.length < maxLen) {
                res += '.';
            }

            return res;
        },
        formatValue(item) {
            if (item.valueMin)
                return this.$formatter.numberOrRangeNew(item.valueMin, item.valueMax);

            return item.value;
        }
    }
};
</script>
