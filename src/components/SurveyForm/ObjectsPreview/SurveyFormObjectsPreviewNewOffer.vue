<template>
    <div class="survey-form-object-preview-offer survey-form-object-preview-offer--new">
        <div class="survey-form-object-preview-offer__wrapper">
            <div class="survey-form-object-preview-offer__content">
                <div class="survey-form-object-preview-offer__main">
                    <div class="survey-form-object-preview-offer__column">
                        <p class="fs-1 font-weight-semi text-danger">Новое</p>
                    </div>
                    <div class="survey-form-object-preview-offer__area">
                        <p class="font-weight-bold fs-3">{{ dealTypeName }}</p>
                        <WithUnitType
                            class="font-weight-bold mb-1"
                            :value="offer.area"
                            :unit-type="unitTypes.SQUARE_METERS"
                        />
                        <p class="fs-2 text-green">
                            <i class="fa-solid fa-key mr-1"></i>
                            <span>{{ availabilityLabel }}</span>
                        </p>
                    </div>
                </div>
                <div class="survey-form-object-preview-offer__info">
                    <div class="survey-form-object-preview-offer__top">
                        <div class="survey-form-object-preview-offer__description">
                            <div v-if="offer.description?.length" v-html="offer.description"></div>
                            <p v-else>Без комментария..</p>
                        </div>
                        <div v-if="editable" class="survey-form-object-preview-offer__actions">
                            <UiButtonIcon
                                @click="$emit('edit')"
                                icon="fa-solid fa-pen"
                                label="Редактировать"
                                small
                            />
                            <UiButtonIcon
                                @click="$emit('delete')"
                                icon="fa-solid fa-trash"
                                label="Удалить"
                                small
                            />
                        </div>
                    </div>
                    <div class="survey-form-object-preview-offer__row">
                        <div
                            class="survey-form-object-preview-offer__block survey-form-object-preview-offer__price"
                        >
                            <p class="fs-1">{{ priceTitle }}</p>
                            <WithUnitType
                                v-if="offer.price"
                                class="font-weight-bold survey-form-object-preview-offer__price-value"
                                :value="offer.price"
                                :unit-type="unitTypes.RUB"
                            />
                            <p v-if="offer.sale_company" class="fs-1 text-primary">
                                Продажа юр.лица
                            </p>
                        </div>
                        <div
                            class="survey-form-object-preview-offer__block survey-form-object-preview-offer__parameters"
                        >
                            <SurveyFormObjectsPreviewOfferParameter
                                icon="fa-solid fa-arrows-down-to-line fa-rotate-180"
                            >
                                <span v-if="offer.ceiling">{{ offer.ceiling }} м</span>
                                <p v-else>-</p>
                            </SurveyFormObjectsPreviewOfferParameter>
                            <SurveyFormObjectsPreviewOfferParameter
                                icon="fa-solid fa-weight-hanging"
                            >
                                <WithUnitType
                                    v-if="offer.load"
                                    :value="offer.load"
                                    :unit-type="unitTypes.TON_PER_SQUARE_METER"
                                />
                                <p v-else>-</p>
                            </SurveyFormObjectsPreviewOfferParameter>
                            <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-bolt">
                                <WithUnitType
                                    v-if="offer.power"
                                    :value="offer.power"
                                    :unit-type="unitTypes.KILOWATT"
                                />
                                <p v-else>-</p>
                            </SurveyFormObjectsPreviewOfferParameter>
                            <SurveyFormObjectsPreviewOfferParameter
                                icon="fa-solid fa-temperature-three-quarters"
                            >
                                <WithUnitType
                                    v-if="offer.temperature"
                                    :value="offer.temperature"
                                    :unit-type="unitTypes.CELCIUS"
                                />
                                <span v-else>-</span>
                            </SurveyFormObjectsPreviewOfferParameter>
                            <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-stairs">
                                {{ offer.floors ?? '-' }}
                            </SurveyFormObjectsPreviewOfferParameter>
                            <SurveyFormObjectsPreviewOfferParameter icon="fa-solid fa-archway">
                                <p v-if="offer.gates">{{ offer.gates }} ворот</p>
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
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { unitTypes } from '@/const/unitTypes.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { toDateFormat } from '@/utils/formatters/date.js';
import SurveyFormObjectsPreviewOfferParameter from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOfferParameter.vue';

defineEmits(['edit', 'delete']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    editable: Boolean
});

const dealTypeName = computed(() => dealOptions.type[props.offer.deal_type]);

const priceTitle = computed(() => {
    if (props.offer.deal_type === dealOptions.typeStatement.SALE) {
        return 'СТАВКА ЗА М2';
    }

    return 'СТАВКА ЗА М2/ГОД';
});

const availabilityLabel = computed(() => {
    if (props.offer.availability) return 'Свободен сейчас';
    if (props.offer.availability_date)
        return `Свободен с ${toDateFormat(props.offer.availability_date, 'с DD.MM.YY')}`;
    return '-';
});
</script>
