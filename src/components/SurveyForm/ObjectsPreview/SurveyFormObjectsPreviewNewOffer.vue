<template>
    <div class="survey-form-object-preview-offer survey-form-object-preview-offer--new">
        <div class="survey-form-object-preview-offer__wrapper">
            <div class="survey-form-object-preview-offer__content">
                <div class="survey-form-object-preview-offer__main">
                    <div class="survey-form-object-preview-offer__column">
                        <Avatar class="mt-4" :src="currentUser.userProfile.avatar" :size="40" />
                        <div class="survey-form-object-preview-offer__badge">Новое</div>
                    </div>
                    <div class="survey-form-object-preview-offer__area text-white">
                        <p class="font-weight-bold fs-3">{{ dealTypeName }}</p>
                        <WithUnitType
                            class="font-weight-bold mb-1"
                            :value="offer.area"
                            :unit-type="areaUnitType"
                        />
                        <p class="fs-2 text-white">
                            <i class="fa-solid fa-key mr-1"></i>
                            <span>{{ availabilityLabel }}</span>
                        </p>
                    </div>
                </div>
                <div class="survey-form-object-preview-offer__info">
                    <div class="survey-form-object-preview-offer__top">
                        <div class="survey-form-object-preview-offer__description">
                            <p>Без описания..</p>
                        </div>
                        <div v-if="editable" class="survey-form-object-preview-offer__actions">
                            <UiButtonIcon
                                @click="$emit('edit')"
                                :disabled
                                icon="fa-solid fa-pen"
                                label="Редактировать"
                                small
                            />
                            <UiButtonIcon
                                @click="$emit('delete')"
                                :disabled
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
            <VueEditor
                v-if="offer.description?.length"
                :model-value="offer.description"
                autofocus
                :min-height="60"
                :max-height="200"
                :toolbar="false"
                disabled
                placeholder="Что необходимо изменить или добавить?"
                class="survey-form-object-preview-offer__editor mt-2 font-weight-bold"
            />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { unitTypes } from '@/const/unitTypes.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import SurveyFormObjectsPreviewOfferParameter from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOfferParameter.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import Avatar from '@/components/common/Avatar.vue';
import { useAuth } from '@/composables/useAuth';

defineEmits(['edit', 'delete']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    editable: Boolean,
    disabled: Boolean
});

const type = {
    1: 'Аренда',
    2: 'Продажа',
    3: 'Ответ-хранение',
    4: 'Субаренда',
    5: 'Built To Rent',
    6: 'Built To Suit'
};

const dealTypeName = computed(() => type[props.offer.deal_type]);

const dealType = computed(() => {
    return Number(props.offer.deal_type);
});

const priceTitle = computed(() => {
    if (
        dealType.value === dealOptions.typeStatement.SALE ||
        dealType.value === 5 ||
        dealType.value === 6
    ) {
        return 'СТАВКА ЗА М2';
    }

    if (dealType.value === dealOptions.typeStatement.STORAGE) {
        return 'СТАВКА ЗА П.М';
    }

    return 'СТАВКА ЗА М2/ГОД';
});

const availabilityLabel = computed(() => {
    if (props.offer.availability == 1) return 'Свободен сейчас';
    if (props.offer.availability == 2) return 'Освообождение по запросу';
    if (props.offer.availability_date)
        return `Свободен с ${toDateFormat(props.offer.availability_date, 'DD.MM.YY')}`;
    return '-';
});

const { currentUser } = useAuth();

const areaUnitType = computed(() => {
    if (props.offer.deal_type === dealOptions.typeStatement.STORAGE) return unitTypes.PALLET_PLACE;
    return unitTypes.SQUARE_METERS;
});
</script>
