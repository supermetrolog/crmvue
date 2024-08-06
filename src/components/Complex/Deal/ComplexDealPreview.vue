<template>
    <div @click="$emit('choose', deal.id)" class="deal-preview" :class="{ active: isCurrent }">
        <button
            v-if="isCurrent"
            v-tippy="'Редактировать'"
            @click.prevent="$emit('edit')"
            class="deal-preview__button"
        >
            <i class="fas fa-pen"></i>
        </button>
        <span class="deal-preview__type">{{ dealName }}</span>
        <p class="deal-preview__company">{{ dealCompany }}</p>
        <template v-if="deal.summaryBlock">
            <with-unit-type class="deal-preview__area" :unit-type="unitTypes.SQUARE_METERS">
                {{ dealArea }}
            </with-unit-type>
            <with-unit-type
                v-if="dealPrice.value !== '0'"
                class="deal-preview__area"
                :unit-type="dealPrice.unitType"
            >
                {{ dealPrice.value }}
            </with-unit-type>
        </template>
        <p
            class="deal-preview__status"
            :class="{
                'deal-preview__status--success':
                    deal.status_id === entityOptions.deal.statusStatement.FOR_RENT,
                'deal-preview__status--danger':
                    deal.status_id === entityOptions.deal.statusStatement.RENTED_OUT ||
                    deal.status_id === entityOptions.deal.statusStatement.SOLD_OUT
            }"
        >
            {{ dealStatus }}
        </p>
        <div class="deal-preview__triangle"></div>
    </div>
</template>

<script setup>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { entityOptions } from '@/const/options/options';
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';
import { reducer } from '@/utils/reducer.js';
import { computed, inject } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatter.js';

defineEmits(['choose', 'edit']);
const objectIsLand = inject('objectIsLand');

const props = defineProps({
    deal: {
        type: Object,
        required: true
    },
    isCurrent: {
        type: Boolean,
        default: false
    }
});

const dealName = computed(() => {
    const dealType = props.deal.deal_type ? props.deal.dealTypeRecord.title : 'Сделка';
    const dealNumber = props.deal.object_id;
    return `${dealType} ${dealNumber}-${dealType[0]}`;
});

const dealCompany = computed(() => {
    return props.deal.companyRecord ? props.deal.companyRecord.nameRu : '--';
});
const dealStatus = computed(() => {
    return entityOptions.deal.status[props.deal.status_id];
});

const dealArea = computed(() => {
    if (objectIsLand) {
        return toNumberOrRangeFormat(
            props.deal.summaryBlock.area_field_min,
            props.deal.summaryBlock.area_field_max
        );
    }

    return toNumberOrRangeFormat(
        props.deal.summaryBlock.area_warehouse_min,
        props.deal.summaryBlock.area_warehouse_max
    );
});

const dealPrice = computed(() => {
    if (props.deal.deal_type === entityOptions.deal.typeStatement.SALE) {
        return {
            value: toNumberOrRangeFormat(
                props.deal.summaryBlock.price_sale_min,
                props.deal.summaryBlock.price_sale_max
            ),
            unitType: unitTypes.RUB_PER_SQUARE_METERS
        };
    }

    if (objectIsLand) {
        return {
            value: toNumberOrRangeFormat(
                props.deal.summaryBlock.price_field_min,
                props.deal.summaryBlock.price_field_max
            ),
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
        };
    }

    const prices = mapper.propertiesToRangeFormat(
        props.deal.summaryBlock,
        entityProperties.offer.priceWithSections.warehouse
    );

    return {
        value: toNumberOrRangeFormat(
            reducer.min(prices, 'valueMin'),
            reducer.max(prices, 'valueMax')
        ),
        unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
    };
});
</script>
