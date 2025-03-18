<template>
    <div class="messenger-quiz-question-template-offer__content">
        <div class="messenger-quiz-question-template-offer__description">
            <h4 v-if="offer.company" class="messenger-quiz-question-template-offer__company">
                {{ companyName }}
            </h4>
            <p class="messenger-quiz-question-template-offer__address">
                <i class="fa-solid fa-earth-americas mr-1"></i>
                <span>{{ offer.object.address }}</span>
                <span v-if="offer.from_mkad">; {{ offer.from_mkad }} км от мкад </span>
            </p>
        </div>
        <div class="d-flex gap-1 flex-wrap mt-1">
            <UiField v-tippy="'Класс объекта'" small color="light">
                {{ offer.class_name }}
            </UiField>
            <UiField v-if="offer.object" v-tippy="'Общая площадь объекта'" small color="light">
                <i class="fa-solid fa-expand"></i>
                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                    {{ fullArea }}
                </WithUnitType>
            </UiField>
            <UiField v-if="offer.offer?.is_exclusive" small color="light">Эксклюзив</UiField>
            <UiField v-if="offer.offer?.built_to_suit === 1" small color="light">
                Инвестпроект
            </UiField>
            <SurveyQuestionOfferMixOffer
                v-for="_offer in offers"
                :key="_offer.id"
                :offer="_offer"
            />
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import SurveyQuestionOfferMixOffer from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMixOffer.vue';
import UiField from '@/components/common/UI/UiField.vue';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    offers: {
        type: Array,
        default: () => []
    }
});

// company

const companyName = computed(() => getCompanyName(props.offer.company, props.offer.company_id));

const fullArea = computed(() => {
    if (props.offer.object.is_land) return toNumberFormat(props.offer.object.area_field_full);
    return toNumberFormat(props.offer.object.area_building);
});
</script>
