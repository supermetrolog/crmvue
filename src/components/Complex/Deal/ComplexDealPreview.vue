<template>
    <div @click="onChooseDeal" class="deal-preview" :class="{ active: isCurrent }">
        <button v-if="isCurrent" v-tippy="'Редактировать'" class="deal-preview__button">
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

<script>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { entityOptions } from '@/const/options/options';
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';
import { reducer } from '@/utils';

export default {
    name: 'ComplexDealPreview',
    components: { WithUnitType },
    emits: ['choose', 'edit'],
    inject: ['objectIsLand'],
    props: {
        deal: {
            type: Object,
            required: true
        },
        isCurrent: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            unitTypes
        };
    },
    computed: {
        entityOptions() {
            return entityOptions;
        },
        dealName() {
            const dealType = this.deal.deal_type ? this.deal.dealTypeRecord.title : 'Сделка';
            const dealNumber = this.deal.object_id;
            return `${dealType} ${dealNumber}-${dealType[0]}`;
        },
        dealCompany() {
            return this.deal.companyRecord ? this.deal.companyRecord.nameRu : '--';
        },
        dealStatus() {
            return entityOptions.deal.status[this.deal.status_id];
        },
        dealArea() {
            if (this.objectIsLand) {
                return this.$formatter.numberOrRangeStrict(
                    this.deal.summaryBlock.area_field_min,
                    this.deal.summaryBlock.area_field_max
                );
            }

            return this.$formatter.numberOrRangeStrict(
                this.deal.summaryBlock.area_warehouse_min,
                this.deal.summaryBlock.area_warehouse_max
            );
        },
        dealPrice() {
            if (this.objectIsLand) {
                return {
                    value: this.$formatter.numberOrRangeStrict(
                        this.deal.summaryBlock.price_field_min,
                        this.deal.summaryBlock.price_field_max
                    ),
                    unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
                };
            }

            if (this.deal.deal_type === entityOptions.deal.typeStatement.SALE) {
                return {
                    value: this.$formatter.numberOrRangeStrict(
                        this.deal.summaryBlock.price_sale_min,
                        this.deal.summaryBlock.price_sale_max
                    ),
                    unitType: unitTypes.RUB_PER_SQUARE_METERS
                };
            }

            const prices = mapper.propertiesToRangeFormat(
                this.deal.summaryBlock,
                entityProperties.offer.priceWithSections.warehouse
            );

            return {
                value: this.$formatter.numberOrRangeStrict(
                    reducer.min(prices, 'valueMin'),
                    reducer.max(prices, 'valueMax')
                ),
                unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
            };
        }
    },
    methods: {
        onChooseDeal() {
            this.$emit('choose', this.deal.id);
        },
        onClickEdit() {
            this.$emit('edit');
        }
    }
};
</script>
