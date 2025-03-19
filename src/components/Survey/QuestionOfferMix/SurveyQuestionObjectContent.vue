<template>
    <div class="messenger-quiz-question-template-offer__content">
        <div class="messenger-quiz-question-template-offer__description">
            <p class="messenger-quiz-question-template-offer__address">
                <i class="fa-solid fa-earth-americas mr-1"></i>
                <span>{{ object.address }}</span>
                <span v-if="object.from_mkad">; {{ object.from_mkad }} км от мкад </span>
            </p>
        </div>
        <div class="d-flex gap-1 flex-wrap mt-1">
            <UiField v-tippy="'Тип объекта'" small color="light">
                <span v-if="object.is_land">Участок</span>
                <span v-else>Строение</span>
            </UiField>
            <UiField v-tippy="'Класс объекта'" small color="light">
                {{ object.object_class_text }}
            </UiField>
            <UiField v-tippy="'Общая площадь объекта'" small color="light">
                <i class="fa-solid fa-expand"></i>
                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                    {{ fullArea }}
                </WithUnitType>
            </UiField>
        </div>
        <div class="d-flex gap-1 flex-wrap mt-1">
            <SurveyQuestionObjectOffer
                v-for="offer in object.offers"
                :key="offer.id"
                :offer="offer"
            />
            <UiField v-if="!object.offers?.length" small color="light">
                <i class="fa-solid fa-ban" />
                <span>Без предложений</span>
            </UiField>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import UiField from '@/components/common/UI/UiField.vue';
import SurveyQuestionObjectOffer from '@/components/Survey/QuestionOfferMix/SurveyQuestionObjectOffer.vue';

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
</script>
