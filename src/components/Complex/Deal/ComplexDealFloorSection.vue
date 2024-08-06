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
<script setup>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';
import Form from '@/components/common/Forms/Form.vue';
import { entityOptions } from '@/const/options/options';
import { computed, shallowRef } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatter.js';

defineEmits(['editSection']);

const props = defineProps({
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
});

const isChecked = shallowRef(props.section ? props.section.checked : false);

const sectionStatus = computed(() => {
    if (props.section.is_active) return 'Свободно, размечено';

    return props.section.deal_type
        ? entityOptions.deal.status[props.section.deal_type]
        : 'Сдано или нераспределено';
});
const formattedArea = computed(() => {
    if (props.section.area_floor_min || props.section.area_floor_max) {
        return toNumberOrRangeFormat(props.section.area_floor_min, props.section.area_floor_max);
    }

    if (props.section.area_mezzanine_min || props.section.area_mezzanine_max) {
        return toNumberOrRangeFormat(
            props.section.area_mezzanine_min,
            props.section.area_mezzanine_max
        );
    }

    if (props.section.area_field_min || props.section.area_field_max) {
        return toNumberOrRangeFormat(props.section.area_field_min, props.section.area_field_max);
    }

    return '--';
});
const sectionAdditionalClass = computed(() => {
    return {
        'deal-section__status--success': props.section.is_active,
        'deal-section__status--danger':
            props.section.deal_type === entityOptions.deal.statusStatement.RENTED_OUT ||
            props.section.deal_type === entityOptions.deal.statusStatement.FOR_RENT,
        'deal-section__status--white': props.section.is_active
    };
});
const appropriateSectionClass = computed(() => {
    if (props.section.is_active) return 'deal-section--green';

    if (
        props.section.deal_type === entityOptions.deal.statusStatement.RENTED_OUT ||
        props.section.deal_type === entityOptions.deal.statusStatement.FOR_RENT
    )
        return 'deal-section--purple';

    return 'deal-section--grey';
});
const checkboxName = computed(() => 'checkbox-' + props.section.id);
</script>
