<template>
    <div class="survey-form-object__content">
        <div class="survey-form-object__description">
            <p class="survey-form-object__address fs-2">
                <span class="fs-2">{{ object.address }}</span>
                <span v-if="object.from_mkad">; {{ object.from_mkad }} км от мкад </span>
            </p>
        </div>
        <div class="d-flex gap-1 flex-wrap fs-2 font-weight-semi">
            <span>{{ object.is_land ? 'Участок' : 'Строение' }}</span>
            <span>|</span>
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                {{ fullArea }}
            </WithUnitType>
            <template v-if="!object.is_land">
                <span>|</span>
                <span>{{ object.object_class_text }} класс</span>
            </template>
        </div>
        <div v-if="object.offers" class="d-flex gap-1 flex-wrap mt-2">
            <SurveyFormObjectOffer
                v-for="offer in preparedOffers"
                :key="offer.id"
                :offer="offer"
                class="survey-form-object__offer mr-1"
            />
            <span v-if="!preparedOffers.length" class="d-flex gap-1 align-items-center">
                <i class="fa-solid fa-ban mb-1" />
                <span>Без активных предложений</span>
            </span>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed, useTemplateRef } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import SurveyFormObjectOffer from '@/components/SurveyForm/Object/SurveyFormObjectOffer.vue';
import { useTippyText } from '@/composables/useTippyText.js';

const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const fullArea = computed(() => {
    if (props.object.is_land) return toNumberFormat(props.object.area_field_full);
    return toNumberFormat(props.object.area_building);
});

useTippyText(useTemplateRef('objectTypeField'), 'Тип объекта');
useTippyText(useTemplateRef('fullAreaField'), 'Общая площадь');

const preparedOffers = computed(() => {
    return props.object.offers.filter(offer => !offer.isDeleted && offer.status === 1);
});
</script>
