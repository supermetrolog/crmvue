<template>
    <div class="additional-details">
        <p v-if="isSaleCompany" class="additional-details__chip">Готов продать компанию</p>
        <h2 v-tippy="'Система налогооблажения'" class="additional-details__title">
            {{ taxForm }}
        </h2>
        <div v-if="hasServices" class="additional-details__services">
            <ComplexDealDetailsService
                v-if="!!priceOpex.status && priceOpex.status !== serviceStatement.UNKNOWN"
                title="Эксплуатация"
                title-alt="Эксплуатационные расходы включены в стоимость"
                :service="priceOpex"
            />
            <ComplexDealDetailsService
                v-if="!!priceService.status && priceService.status !== serviceStatement.UNKNOWN"
                title="Коммунальные услуги"
                title-alt="Коммунальные услуги включены в стоимость"
                :service="priceService"
            />
        </div>
        <ComplexDealDetailsSpecialTerms v-if="hasSpecialTerms" :terms="specialTerms" />
        <ComplexDealDetailsBusiness
            v-if="hasBusiness"
            class="additional-details__business"
            :properties="businessProperties"
        />
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes.js';
import ComplexDealDetailsBusiness from '@/components/Complex/Deal/Details/ComplexDealDetailsBusiness.vue';
import { entityProperties } from '@/const/properties/properties';
import { entityOptions } from '@/const/options/options';
import ComplexDealDetailsService from '@/components/Complex/Deal/Details/ComplexDealDetailsService.vue';
import ComplexDealDetailsSpecialTerms from '@/components/Complex/Deal/Details/ComplexDealDetailsSpecialTerms.vue';

export default {
    name: 'ComplexDealDetails',
    components: {
        ComplexDealDetailsSpecialTerms,
        ComplexDealDetailsService,
        ComplexDealDetailsBusiness
    },
    props: {
        deal: {
            type: Object,
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        serviceStatement() {
            return entityOptions.deal.priceServiceStatement;
        },
        taxForm() {
            if (this.deal.tax_form) return entityOptions.deal.tax[this.deal.tax_form];
            return null;
        },
        hasBusiness() {
            return this.deal.rent_business === entityOptions.defaults.booleanStatement.TRUE;
        },
        businessProperties() {
            return Object.keys(entityProperties.deal.rentBusiness).map(property => ({
                ...entityProperties.deal.rentBusiness[property],
                value: this.deal[property]
            }));
        },
        hasServices() {
            return (
                (!!this.deal.price_opex &&
                    this.deal.price_opex !== this.serviceStatement.UNKNOWN) ||
                (!!this.deal.public_services &&
                    this.deal.public_services !== this.serviceStatement.UNKNOWN)
            );
        },
        hasSpecialTerms() {
            return (
                this.deal.deal_type !== entityOptions.deal.typeStatement.SALE &&
                (this.deal.holidays || this.deal.deposit || this.deal.pledge)
            );
        },
        specialTerms() {
            return [
                {
                    label: 'Каникулы',
                    property: this.deal.holidays,
                    value: this.deal.holidays_value_min
                        ? this.$formatter.numberOrRangeNew(
                              this.deal.holidays_value_min,
                              this.deal.holidays_value_max
                          )
                        : null
                },
                {
                    label: 'Депозит',
                    property: this.deal.deposit,
                    value: this.deal.deposit_value
                },
                {
                    label: 'Залоговый платеж',
                    property: this.deal.pledge
                }
            ].filter(element => element.property);
        },
        priceOpex() {
            const priceObject = {
                status: this.deal.price_opex,
                label: entityOptions.deal.servicePrice[this.deal.price_opex] || '-',
                name: 'Цена OPEX',
                value: null
            };

            if (this.deal.price_opex === entityOptions.deal.priceServiceStatement.NOT_INCLUDED)
                priceObject.value = this.deal.price_opex_value;
            else if (this.deal.price_opex === entityOptions.deal.priceServiceStatement.PARTLY)
                priceObject.items = this.deal.inc_opex.map(option => ({
                    ...entityOptions.deal.opex[option]
                }));

            return priceObject;
        },
        priceService() {
            const priceObject = {
                status: this.deal.public_services,
                label: entityOptions.deal.servicePrice[this.deal.public_services] || '-',
                name: 'Ком. платеж',
                value: null
            };

            if (this.deal.public_services === entityOptions.deal.priceServiceStatement.NOT_INCLUDED)
                priceObject.value = this.deal.price_public_services;
            else if (this.deal.public_services === entityOptions.deal.priceServiceStatement.PARTLY)
                priceObject.items = this.deal.inc_services.map(option => ({
                    ...entityOptions.deal.publicServices[option]
                }));

            return priceObject;
        },
        isSaleCompany() {
            return this.deal.sale_company === entityOptions.deal.saleCompanyStatement.READY_TO_SALE;
        }
    }
};
</script>
