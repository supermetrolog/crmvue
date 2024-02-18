<template>
    <div class="trade-offer-part deal-section" :class="appropriateSectionClass">
        <span class="trade-offer-part__id">Блок #{{ part.id }}</span>
        <p class="trade-offer-part__area">
            <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                {{ formattedArea }}
            </with-unit-type>
            <Tooltip icon="fa-regular fa-circle-question">
                <template #content>
                    <ul class="trade-offer-part__description">
                        <li v-if="formattedArea" class="trade-offer-part__value">
                            <span>S - складская:</span>
                            <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                {{ formattedArea }}
                            </with-unit-type>
                        </li>
                        <li v-if="part.area_office_min" class="trade-offer-part__value">
                            <span>S - офисная:</span>
                            <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                {{
                                    $formatter.numberOrRangeNew(
                                        part.area_office_min,
                                        part.area_office_max
                                    )
                                }}
                            </with-unit-type>
                        </li>
                        <li v-if="part.area_tech_min" class="trade-offer-part__value">
                            <span>S - техническая:</span>
                            <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                {{
                                    $formatter.numberOrRangeNew(
                                        part.area_tech_min,
                                        part.area_tech_max
                                    )
                                }}
                            </with-unit-type>
                        </li>
                    </ul>
                </template>
            </Tooltip>
        </p>
        <p class="deal-section__status" :class="sectionAdditionalClass">
            {{ sectionStatus }}
        </p>
    </div>
</template>
<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import { DealStatusList, DealStatusType } from '@/const/const';
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'ComplexOfferPartsItem',
    components: { Tooltip, WithUnitType },
    props: {
        part: {
            type: Object,
            required: true
        }
    },
    computed: {
        unitTypes: () => unitTypes,
        formattedArea() {
            if (this.part.area_floor_min || this.part.area_floor_max) {
                return this.$formatter.numberOrRangeNew(
                    this.part.area_floor_min,
                    this.part.area_floor_max
                );
            }

            if (this.part.area_mezzanine_min || this.part.area_mezzanine_max) {
                return this.$formatter.numberOrRangeNew(
                    this.part.area_mezzanine_min,
                    this.part.area_mezzanine_max
                );
            }

            return '--';
        },
        sectionStatus() {
            if (this.part.is_active) return 'Свободно, размечено';

            return this.part.deal_type
                ? DealStatusList[this.part.deal_type]
                : 'Сдано или нераспределено';
        },
        sectionAdditionalClass() {
            return {
                'deal-section__status--success': this.part.is_active,
                'deal-section__status--danger':
                    this.part.deal_type === DealStatusType.RENTED_OUT ||
                    this.part.deal_type === DealStatusType.FOR_RENT,
                'deal-section__status--white': this.part.is_active
            };
        },
        appropriateSectionClass() {
            if (this.part.is_active) return 'deal-section--green';
            if (
                this.part.deal_type === DealStatusType.RENTED_OUT ||
                this.part.deal_type === DealStatusType.FOR_RENT
            )
                return 'deal-section--purple';

            return 'deal-section--grey';
        }
    }
};
</script>
