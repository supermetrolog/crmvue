<template>
    <div
        class="survey-form-object-preview-offer"
        :class="{ success: hasSuccessStatus, fail: hasFailStatus, editing: needEditing }"
    >
        <div class="survey-form-object-preview-offer__wrapper">
            <div class="survey-form-object-preview-offer__content">
                <div class="survey-form-object-preview-offer__block">
                    <p class="fs-2 text-grey">{{ visualId }} {{ dealTypeName }}</p>
                    <WithUnitType
                        class="font-weight-semi"
                        :value="offer.snapshot.area"
                        :unit-type="unitTypes.SQUARE_METERS"
                    />
                    <p class="text-grey fs-1">Деление: [в разработке]</p>
                </div>
                <div class="survey-form-object-preview-offer__block">
                    <p class="fs-2 text-grey">{{ priceTitle }}</p>
                    <WithUnitType
                        class="font-weight-semi text-primary"
                        :value="offer.snapshot.price"
                        :unit-type="unitTypes.RUB"
                    />
                </div>
                <div class="survey-form-object-preview-offer__block">
                    <p class="fs-2 font-weight-semi">
                        Доступ: <span class="text-grey fs-2">[в разработке]</span>
                    </p>
                </div>
                <SurveyCardAdvancedObjectsPreviewOfferParameters
                    class="survey-form-object-preview-offer__block"
                    :offer="offer.snapshot"
                    :object
                />
            </div>
            <AnimationTransition :speed="0.5">
                <VueEditor
                    v-if="needEditing"
                    :model-value="offer.description"
                    autofocus
                    :min-height="60"
                    :max-height="200"
                    :toolbar="false"
                    disabled
                    placeholder="Что необходимо изменить или добавить?"
                    class="survey-form-object-preview-offer__editor mt-2"
                />
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { dealOptions } from '@/const/options/deal.options.js';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SurveyCardAdvancedObjectsPreviewOfferParameters from '@/components/SurveyCard/SurveyCardAdvancedObjectsPreviewOfferParameters.vue';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    object: {
        type: Object,
        required: true
    }
});

const dealTypeName = computed(() => dealOptions.type[props.offer.snapshot.deal_type]);
const visualId = computed(() => `ID ${props.object.id}-${dealTypeName.value[0]}`);

const priceTitle = computed(() => {
    if (props.offer.snapshot.deal_type === dealOptions.typeStatement.SALE) {
        return 'СТАВКА ЗА М2';
    }

    return 'СТАВКА ЗА М2/ГОД';
});

// form

const ANSWER = {
    SUCCESS: '1',
    FAIL: '2',
    EDIT: '3'
};

const hasSuccessStatus = computed(() => props.offer.answer === ANSWER.SUCCESS);
const hasFailStatus = computed(() => props.offer.answer === ANSWER.FAIL);
const needEditing = computed(() => props.offer.answer === ANSWER.EDIT);
</script>
