<template>
    <div @click="onChooseDeal" class="deal-preview" :class="{ active: isCurrent }">
        <button v-if="isCurrent" v-tippy="'Редактировать'" class="deal-preview__button">
            <i class="fas fa-pen"></i>
        </button>
        <span class="deal-preview__type">{{ dealName }}</span>
        <p class="deal-preview__company">{{ dealCompany }}</p>
        <p class="deal-preview__area">
            {{ dealArea }}
            <span class="deal-preview__unit">м<sup>2</sup></span>
        </p>
        <p class="DealPreviewCard-price">
            <with-unit-type :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_MONTH">
                {{ dealPrice }}
            </with-unit-type>
        </p>
        <p
            class="deal-preview__status"
            :class="{
                'deal-preview__status--success': deal.status_id === DealStatusType.FOR_RENT,
                'deal-preview__status--danger':
                    deal.status_id === DealStatusType.RENTED_OUT ||
                    deal.status_id === DealStatusType.SOLD_OUT
            }"
        >
            {{ dealStatus }}
        </p>
        <div class="deal-preview__triangle"></div>
    </div>
</template>

<script>
import { DealStatusList, DealStatusType, DealTypeList } from '@/const/const';
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';

export default {
    name: 'ComplexDealPreview',
    components: { WithUnitType },
    emits: ['choose', 'edit'],
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
            DealStatusType,
            unitTypes
        };
    },
    computed: {
        dealTypeList: () => DealTypeList,
        dealName() {
            const dealType = this.deal.deal_type ? this.deal.dealTypeRecord.title : 'Сделка';
            const dealNumber = this.deal.object_id;
            return `${dealType} ${dealNumber}-${dealType[0]}`;
        },
        dealCompany() {
            return this.deal.companyRecord ? this.deal.companyRecord.nameRu : '--';
        },
        dealStatus() {
            return DealStatusList[this.deal.status_id];
        },
        dealArea() {
            if (this.deal.calculated_area_min || this.deal.calculated_area_max)
                return this.$formatter.numberOrRangeNew(
                    this.deal.calculated_area_min,
                    this.deal.calculated_area_max
                );

            return '--';
        },
        dealPrice() {
            if (this.deal.calculated_price_min || this.deal.calculated_price_max)
                return this.$formatter.numberOrRangeNew(
                    this.deal.calculated_price_min,
                    this.deal.calculated_price_max
                );

            return '--';
        },
        typePresence() {
            return this.deal.price.type && this.deal.price.valueMin;
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
