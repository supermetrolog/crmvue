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
                        class="font-weight-bold"
                        :value="calculatedArea"
                        :unit-type="unitTypes.SQUARE_METERS"
                    />
                    <p class="text-grey fs-1">Деление: [в разработке]</p>
                </div>
                <div class="survey-form-object-preview-offer__block">
                    <p class="fs-2 text-grey">{{ priceTitle }}</p>
                    <WithUnitType
                        class="font-weight-bold text-primary"
                        :value="calculatedPrice"
                        :unit-type="unitTypes.RUB"
                    />
                    <template v-if="!passive">
                        <p v-if="commercialOffer.sale_company === 1" class="fs-1 text-primary">
                            Продажа юр.лица
                        </p>
                        <p class="fs-1 text-primary">
                            <span v-if="commercialOffer.tax_form">{{ taxTitle }}</span>
                            <span v-if="commercialOffer.price_opex"> | OPEX - {{ opex }}</span>
                            <span v-if="commercialOffer.public_services">
                                | КУ - {{ publicServices }}
                            </span>
                        </p>
                        <p v-if="commercialOffer.built_to_suit === 1" class="fs-1 text-success">
                            <span>{{ builtToSuitType }}</span>
                            <span v-if="commercialOffer.built_to_suit_time">
                                / {{ commercialOffer.built_to_suit_time }} мес.
                            </span>
                        </p>
                    </template>
                </div>
                <div class="survey-form-object-preview-offer__block">
                    <p class="fs-2 font-weight-semi">
                        Доступ: <span class="text-grey fs-2">[в разработке]</span>
                    </p>
                    <p class="fs-2 font-weight-semi">
                        В рекламе:
                        <span :class="hasAdv ? 'text-success' : 'text-danger'">
                            {{ hasAdv ? 'ДА' : 'НЕТ' }}
                        </span>
                    </p>
                </div>
                <SurveyFormObjectsPreviewOfferParameters
                    class="survey-form-object-preview-offer__block"
                    :object
                    :offer
                />
            </div>
            <AnimationTransition v-if="editable" :speed="0.5">
                <VueEditor
                    v-if="needEditing"
                    v-model="modelValue.description"
                    autofocus
                    :min-height="60"
                    :max-height="200"
                    :toolbar="false"
                    placeholder="Что необходимо изменить или добавить?"
                    class="survey-form-object-preview-offer__editor mt-2"
                />
            </AnimationTransition>
        </div>
        <div v-if="editable" class="survey-form-object-preview-offer__actions">
            <UiButtonIcon
                @click="selectAnswer(ANSWER.SUCCESS)"
                :active="modelValue.answer === ANSWER.SUCCESS"
                icon="fa-solid fa-thumbs-up"
                label="Актуально без изменений"
            />
            <UiButtonIcon
                @click="selectAnswer(ANSWER.FAIL)"
                :active="modelValue.answer === ANSWER.FAIL"
                icon="fa-solid fa-thumbs-down"
                label="Больше не актуально"
            />
            <UiButtonIcon
                @click="selectAnswer(ANSWER.EDIT)"
                :active="modelValue.answer === ANSWER.EDIT"
                icon="fa-solid fa-pen"
                label="Внести изменения"
            />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { dealOptions } from '@/const/options/deal.options.js';
import SurveyFormObjectsPreviewOfferParameters from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOfferParameters.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const modelValue = defineModel({ type: Object, default: () => ({}) });

const emit = defineEmits(['change']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    commercialOffer: {
        type: Object,
        required: true
    },
    object: {
        type: Object,
        required: true
    },
    editable: Boolean,
    passive: Boolean
});

const dealTypeName = computed(() => dealOptions.type[props.commercialOffer.deal_type]);

const visualId = computed(() => `ID ${props.object.id}-${dealTypeName.value[0]}`);

const calculatedArea = computed(() => {
    return toNumberOrRangeFormat(props.offer.area_min, props.offer.area_max);
});

const priceTitle = computed(() => {
    if (props.commercialOffer.deal_type === dealOptions.typeStatement.SALE) {
        return 'СТАВКА ЗА М2';
    }

    return 'СТАВКА ЗА М2/ГОД';
});

const calculatedPrice = computed(() => {
    if (props.object.is_land) {
        return toNumberOrRangeFormat(props.offer.price_sale_min, props.offer.price_sale_max);
    }

    return toNumberOrRangeFormat(props.offer.price_floor_min, props.offer.price_floor_max);
});

const hasAdv = computed(() => {
    return props.offer.ad_avito || props.offer.ad_cian || props.offer.ad_yandex;
});
// prices

const taxTitle = computed(() => dealOptions.tax[props.commercialOffer.tax_form]);

const opex = computed(() => dealOptions.servicePrice[props.commercialOffer.price_opex]);

const publicServices = computed(
    () => dealOptions.servicePrice[props.commercialOffer.public_services]
);

const builtToSuitType = computed(() => {
    return props.commercialOffer.deal_type === dealOptions.typeStatement.SALE
        ? 'Built To Sale'
        : 'Built To Rent';
});

// TODO: Что за деление?

// form

const ANSWER = {
    SUCCESS: '1',
    FAIL: '2',
    EDIT: '3'
};

function selectAnswer(value) {
    if (modelValue.value.answer === value) {
        modelValue.value.answer = 0;
    } else {
        modelValue.value.answer = value;
    }

    emit('change');
}

const hasSuccessStatus = computed(() => modelValue.value.answer === ANSWER.SUCCESS);
const hasFailStatus = computed(() => modelValue.value.answer === ANSWER.FAIL);
const needEditing = computed(() => modelValue.value.answer === ANSWER.EDIT);
</script>
