<template>
    <div class="additional-details">
        <p v-if="isSaleCompany" class="additional-details__chip">Готов продать компанию</p>
        <h2 v-tippy="'Система налогооблажения'" class="additional-details__title">
            {{ taxForm }}
        </h2>
        <div class="additional-details__specials">
            <p class="additional-details__category">Дополнительные расходы</p>
            <ul class="additional-details__list">
                <ComplexDealDetailsService title="OPEX" :service="priceOpex" />
                <ComplexDealDetailsService title="Ком. услуги" :service="priceService" />
            </ul>
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
import { dealOptions } from '@/const/options/deal.options.js';

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
    switch (props.deal.price_opex) {
        case dealOptions.priceServiceStatement.INCLUDED: {
            return { label: 'Включено в стоимость' };
        }
        case dealOptions.priceServiceStatement.PARTLY: {
            return {
                items: props.deal.inc_opex.map(option => ({
                    ...dealOptions.opex[option]
                }))
            };
        }
        case dealOptions.priceServiceStatement.NOT_INCLUDED: {
            return { value: props.deal.price_opex_value };
        }
        case dealOptions.priceServiceStatement.UNKNOWN: {
            return { label: 'Неизвестно' };
        }
        default: {
            return { label: 'Не заполнено' };
        }
    }
});

const priceService = computed(() => {
    switch (props.deal.public_services) {
        case dealOptions.priceServiceStatement.INCLUDED: {
            return { label: 'Включено в стоимость' };
        }
        case dealOptions.priceServiceStatement.PARTLY: {
            return {
                items: props.deal.inc_opex.map(option => ({
                    ...dealOptions.publicServices[option]
                }))
            };
        }
        case dealOptions.priceServiceStatement.NOT_INCLUDED: {
            return { value: props.deal.price_public_services };
        }
        case dealOptions.priceServiceStatement.UNKNOWN: {
            return { label: 'Неизвестно' };
        }
        default: {
            return { label: 'Не заполнено' };
        }
    }
});

console.log(props.deal);

const isSaleCompany = computed(
    () => props.deal.sale_company === entityOptions.deal.saleCompanyStatement.READY_TO_SALE
);
</script>
