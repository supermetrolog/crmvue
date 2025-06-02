<template>
    <div class="survey-form-object-preview-offer survey-form-object-preview-offer--new">
        <div class="survey-form-object-preview-offer__wrapper">
            <div class="survey-form-object-preview-offer__content">
                <div class="survey-form-object-preview-offer__block">
                    <UiField class="mb-1" color="success" small>
                        <i class="fa-solid fa-plus" />
                        <span>{{ dealTypeName }}</span>
                    </UiField>
                    <WithUnitType
                        v-if="offer.area"
                        class="font-weight-semi"
                        :value="calculatedArea"
                        :unit-type="unitTypes.SQUARE_METERS"
                    />
                    <p v-else class="font-weight-semi">-</p>
                </div>
                <div class="survey-form-object-preview-offer__block">
                    <p class="fs-2 text-grey">{{ priceTitle }}</p>
                    <WithUnitType
                        v-if="offer.price"
                        class="font-weight-semi text-primary"
                        :value="calculatedPrice"
                        :unit-type="unitTypes.RUB"
                    />
                    <p v-else class="font-weight-semi text-primary">-</p>
                    <p v-if="offer.sale_company" class="fs-1 text-primary">Продажа юр.лица</p>
                </div>
                <div class="survey-form-object-preview-offer__block">
                    <p class="fs-2 font-weight-semi">
                        Доступ: <span class="text-grey fs-2">{{ availabilityLabel }}</span>
                    </p>
                </div>
                <div
                    class="survey-form-object-preview-offer__block survey-form-object-preview-offer__parameters"
                >
                    <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-stairs">
                        {{ offer.floors ?? '-' }}
                    </SurveyFormObjectsPreviewOfferParameter>
                    <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-archway">
                        <p v-if="offer.gates">{{ offer.gates }} ворот</p>
                        <p v-else>-</p>
                    </SurveyFormObjectsPreviewOfferParameter>
                    <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-bolt">
                        <WithUnitType
                            v-if="offer.power"
                            :value="Number(offer.power)"
                            :unit-type="unitTypes.KILOWATT"
                        />
                        <p v-else>-</p>
                    </SurveyFormObjectsPreviewOfferParameter>
                    <SurveyFormObjectsPreviewOfferParameter
                        icon="fa-solid fa-arrows-down-to-line fa-rotate-180"
                    >
                        <span v-if="offer.ceiling">{{ offer.ceiling }} м</span>
                        <p v-else>-</p>
                    </SurveyFormObjectsPreviewOfferParameter>
                    <SurveyFormObjectsPreviewOfferParameter icon="fas fa-hashtag">
                        {{ offer.floor_type ?? '-' }}
                    </SurveyFormObjectsPreviewOfferParameter>
                    <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-sign-hanging">
                        <span v-if="offer.cranes">{{ offer.cranes }} кран(а)</span>
                        <p v-else>-</p>
                    </SurveyFormObjectsPreviewOfferParameter>
                </div>
            </div>
            <VueEditor
                v-model="form"
                autofocus
                :min-height="60"
                :max-height="200"
                :toolbar="false"
                :disabled="!editable"
                placeholder="Описание предложения"
                class="survey-form-object-preview-offer__editor mt-2"
            />
        </div>
        <div v-if="editable" class="survey-form-object-preview-offer__actions">
            <UiButtonIcon @click="$emit('edit')" icon="fa-solid fa-pen" label="Редактировать" />
            <UiButtonIcon @click="$emit('delete')" icon="fa-solid fa-trash" label="Удалить" />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { unitTypes } from '@/const/unitTypes.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { toDateFormat } from '@/utils/formatters/date.js';
import SurveyFormObjectsPreviewOfferParameter from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOfferParameter.vue';
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['edit', 'delete']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    editable: Boolean
});

const form = defineModel();

const dealTypeName = computed(() => dealOptions.type[props.offer.deal_type]);

const calculatedArea = computed(() => toNumberFormat(props.offer.area));
const calculatedPrice = computed(() => toNumberFormat(props.offer.price));

const priceTitle = computed(() => {
    if (props.offer.deal_type === dealOptions.typeStatement.SALE) {
        return 'СТАВКА ЗА М2';
    }

    return 'СТАВКА ЗА М2/ГОД';
});

const availabilityLabel = computed(() => {
    if (props.offer.availability) return 'Доступен';
    if (props.offer.availability_date)
        return toDateFormat(props.offer.availability_date, 'с DD.MM.YY');
    return '-';
});
</script>
