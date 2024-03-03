<template>
    <div v-if="empty" class="deal-section deal-section--grey">
        <with-unit-type class="deal-section__area" :unit-type="unitTypes.SQUARE_METERS">
            {{ emptyArea }}
        </with-unit-type>
        <p class="deal-section__status">Нераспред. площадь</p>
    </div>
    <div v-else class="deal-section" :class="appropriateSectionClass">
        <with-unit-type class="deal-section__area" :unit-type="unitTypes.SQUARE_METERS">
            {{ formattedArea }}
        </with-unit-type>
        <p class="deal-section__status" :class="sectionAdditionalClass">
            {{ sectionStatus }}
        </p>
        <div class="deal-section__functions">
            <i
                v-tippy="`Редактировать`"
                @click="$emit('editSection', section)"
                class="fas fa-pen deal-section__button"
            />
            <Form v-if="section.is_active" class="deal-section__form">
                <input
                    :id="checkboxName"
                    v-model="isChecked"
                    class="deal-section__checkbox"
                    type="checkbox"
                    :checked="isChecked"
                />
                <label class="deal-section__checkbox-label" :for="checkboxName" />
            </Form>
        </div>
    </div>
</template>
<script>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';
import Form from '@/components/common/Forms/Form.vue';
import { entityOptions } from '@/const/options/options';

export default {
    name: 'ComplexDealFloorSection',
    components: { WithUnitType, Form },
    emits: ['editSection'],
    props: {
        section: {
            type: Object,
            default: () => {}
        },
        empty: {
            type: Boolean,
            default: false
        },
        emptyArea: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            unitTypes,
            isChecked: this.section ? this.section.checked : false
        };
    },
    computed: {
        sectionStatus() {
            if (this.section.is_active) return 'Свободно, размечено';

            return this.section.deal_type
                ? entityOptions.deal.status[this.section.deal_type]
                : 'Сдано или нераспределено';
        },
        formattedArea() {
            if (this.section.area_floor_min || this.section.area_floor_max) {
                return this.$formatter.numberOrRangeNew(
                    this.section.area_floor_min,
                    this.section.area_floor_max
                );
            }

            if (this.section.area_mezzanine_min || this.section.area_mezzanine_max) {
                return this.$formatter.numberOrRangeNew(
                    this.section.area_mezzanine_min,
                    this.section.area_mezzanine_max
                );
            }

            if (this.section.area_field_min || this.section.area_field_max) {
                return this.$formatter.numberOrRangeNew(
                    this.section.area_field_min,
                    this.section.area_field_max
                );
            }

            return '--';
        },
        sectionAdditionalClass() {
            return {
                'deal-section__status--success': this.section.is_active,
                'deal-section__status--danger':
                    this.section.deal_type === entityOptions.deal.statusStatement.RENTED_OUT ||
                    this.section.deal_type === entityOptions.deal.statusStatement.FOR_RENT,
                'deal-section__status--white': this.section.is_active
            };
        },
        appropriateSectionClass() {
            if (this.section.is_active) return 'deal-section--green';
            if (
                this.section.deal_type === entityOptions.deal.statusStatement.RENTED_OUT ||
                this.section.deal_type === entityOptions.deal.statusStatement.FOR_RENT
            )
                return 'deal-section--purple';

            return 'deal-section--grey';
        },
        checkboxName() {
            return 'checkbox-' + this.section.id;
        }
    }
};
</script>
