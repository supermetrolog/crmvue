<template>
    <div class="additional-details">
        <p v-if="isSaleCompany" class="additional-details__chip">Готов продать компанию</p>
        <h2 v-tippy="'Система налогооблажения'" class="additional-details__title">
            {{ taxForm }}
        </h2>
        <div v-if="hasServices" class="additional-details__services">
            <ComplexDealDetailsService
                v-if="
                    !!priceOpex.status &&
                    priceOpex.status !== entityOptions.deal.priceServiceStatement.UNKNOWN
                "
                title="Эксплуатация"
                title-alt="Эксплуатационные расходы включены в стоимость"
                :service="priceOpex"
            />
            <ComplexDealDetailsService
                v-if="
                    !!priceService.status &&
                    priceService.status !== entityOptions.deal.priceServiceStatement.UNKNOWN
                "
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

<script setup>
import ComplexDealDetailsBusiness from '@/components/Complex/Deal/Details/ComplexDealDetailsBusiness.vue';
import { entityProperties } from '@/const/properties/properties';
import { entityOptions } from '@/const/options/options';
import ComplexDealDetailsService from '@/components/Complex/Deal/Details/ComplexDealDetailsService.vue';
import ComplexDealDetailsSpecialTerms from '@/components/Complex/Deal/Details/ComplexDealDetailsSpecialTerms.vue';
import { computed } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatter.js';

const props = defineProps({
    deal: {
        type: Object,
        required: true
    }
});

const taxForm = computed(() => {
    if (props.deal.tax_form) return entityOptions.deal.tax[props.deal.tax_form];
    return null;
});
const hasBusiness = computed(
    () => props.deal.rent_business === entityOptions.defaults.booleanStatement.TRUE
);
const businessProperties = computed(() => {
    return Object.keys(entityProperties.deal.rentBusiness).map(property => ({
        ...entityProperties.deal.rentBusiness[property],
        value: props.deal[property]
    }));
});
const hasServices = computed(() => {
    return (
        (!!props.deal.price_opex &&
            props.deal.price_opex !== entityOptions.deal.priceServiceStatement.UNKNOWN) ||
        (!!props.deal.public_services &&
            props.deal.public_services !== entityOptions.deal.priceServiceStatement.UNKNOWN)
    );
});
const hasSpecialTerms = computed(() => {
    return (
        props.deal.deal_type !== entityOptions.deal.typeStatement.SALE &&
        (props.deal.holidays || props.deal.deposit || props.deal.pledge)
    );
});

const specialTerms = computed(() => {
    return [
        {
            label: 'Каникулы',
            property: props.deal.holidays,
            value: props.deal.holidays_value_min
                ? toNumberOrRangeFormat(
                      props.deal.holidays_value_min,
                      props.deal.holidays_value_max
                  )
                : null
        },
        {
            label: 'Депозит',
            property: props.deal.deposit,
            value: props.deal.deposit_value
        },
        {
            label: 'Залоговый платеж',
            property: props.deal.pledge
        }
    ].filter(element => element.property);
});

const priceOpex = computed(() => {
    const priceObject = {
        status: props.deal.price_opex,
        label: entityOptions.deal.servicePrice[props.deal.price_opex] || '-',
        name: 'Цена OPEX',
        value: null
    };

    if (props.deal.price_opex === entityOptions.deal.priceServiceStatement.NOT_INCLUDED)
        priceObject.value = props.deal.price_opex_value;
    else if (props.deal.price_opex === entityOptions.deal.priceServiceStatement.PARTLY)
        priceObject.items = props.deal.inc_opex.map(option => ({
            ...entityOptions.deal.opex[option]
        }));

    return priceObject;
});

const priceService = computed(() => {
    const priceObject = {
        status: props.deal.public_services,
        label: entityOptions.deal.servicePrice[props.deal.public_services] || '-',
        name: 'Ком. платеж',
        value: null
    };

    if (props.deal.public_services === entityOptions.deal.priceServiceStatement.NOT_INCLUDED)
        priceObject.value = props.deal.price_public_services;
    else if (props.deal.public_services === entityOptions.deal.priceServiceStatement.PARTLY)
        priceObject.items = props.deal.inc_services.map(option => ({
            ...entityOptions.deal.publicServices[option]
        }));

    return priceObject;
});

const isSaleCompany = computed(
    () => props.deal.sale_company === entityOptions.deal.saleCompanyStatement.READY_TO_SALE
);
</script>
