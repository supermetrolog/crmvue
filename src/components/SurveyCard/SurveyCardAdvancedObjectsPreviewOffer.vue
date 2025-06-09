<template>
    <div
        class="survey-form-object-preview-offer"
        :class="{
            success: hasSuccessStatus || needEditing,
            danger: hasFailStatus,
            warning: needEditing
        }"
    >
        <div class="survey-form-object-preview-offer__wrapper">
            <div class="survey-form-object-preview-offer__content">
                <div class="survey-form-object-preview-offer__main">
                    <div class="survey-form-object-preview-offer__column">
                        <p class="fs-1 font-weight-semi">{{ visualId }}</p>
                    </div>
                    <div class="survey-form-object-preview-offer__area">
                        <p class="font-weight-bold fs-3">{{ dealTypeName }}</p>
                        <WithUnitType
                            class="font-weight-bold mb-1"
                            :value="offer.snapshot.area"
                            :unit-type="unitTypes.SQUARE_METERS"
                        />
                    </div>
                </div>
                <div class="survey-form-object-preview-offer__info">
                    <div class="survey-form-object-preview-offer__top">
                        <div class="survey-form-object-preview-offer__description">
                            <p>Комментарий по предложению доступен на странице объекта..</p>
                        </div>
                        <div class="survey-form-object-preview-offer__actions">
                            <UiButtonIcon
                                :active="hasSuccessStatus"
                                icon="fa-solid fa-thumbs-up"
                                label="Актуально без изменений"
                                disabled
                            />
                            <UiButtonIcon
                                :active="hasFailStatus"
                                icon="fa-solid fa-thumbs-down"
                                label="Больше не актуально"
                                class="survey-form-object-preview-offer__action-negative"
                                disabled
                            />
                            <UiButtonIcon
                                :active="needEditing"
                                icon="fa-solid fa-pen"
                                label="Внести изменения"
                                class="survey-form-object-preview-offer__action-warning"
                                disabled
                            />
                        </div>
                    </div>
                    <div class="survey-form-object-preview-offer__row">
                        <div
                            class="survey-form-object-preview-offer__block survey-form-object-preview-offer__price"
                        >
                            <p class="fs-1">
                                <span>{{ priceTitle }}</span>
                            </p>
                            <WithUnitType
                                class="font-weight-bold survey-form-object-preview-offer__price-value"
                                :value="offer.snapshot.price"
                                :unit-type="unitTypes.RUB"
                            />
                            <p v-if="offer.snapshot.sale_company === 1" class="fs-1 text-primary">
                                Продажа юр.лица
                            </p>
                        </div>
                        <SurveyCardAdvancedObjectsPreviewOfferParameters
                            class="survey-form-object-preview-offer__block"
                            :offer="offer.snapshot"
                            :object
                        />
                    </div>
                </div>
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
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

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
    SUCCESS: 1,
    FAIL: 2,
    EDIT: 3
};

const hasSuccessStatus = computed(() => Number(props.offer.answer) === ANSWER.SUCCESS);
const hasFailStatus = computed(() => Number(props.offer.answer) === ANSWER.FAIL);
const needEditing = computed(() => Number(props.offer.answer) === ANSWER.EDIT);
</script>
