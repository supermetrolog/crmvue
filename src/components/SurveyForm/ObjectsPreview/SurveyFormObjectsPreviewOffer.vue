<template>
    <div
        class="survey-form-object-preview-offer"
        :class="{
            completed: hasStatus,
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
                        <Avatar :src="avatar" :size="40" />
                        <UiDropdownActions>
                            <template #trigger>
                                <UiDropdownActionsTrigger
                                    label="Действия над предложением"
                                    color="light"
                                    class="op-7"
                                />
                            </template>
                            <template #menu>
                                <UiDropdownActionsButton
                                    @handle="$emit('create-task')"
                                    label="Создать задачу"
                                    icon="fa-solid fa-bolt"
                                />
                            </template>
                        </UiDropdownActions>
                    </div>
                    <div class="survey-form-object-preview-offer__area">
                        <p class="font-weight-bold fs-3">{{ dealTypeName }}</p>
                        <WithUnitType
                            class="font-weight-bold mb-1"
                            :value="calculatedArea"
                            :unit-type="unitTypes.SQUARE_METERS"
                        />
                        <!--                        <p class="fs-2">-->
                        <!--                            Доступ: <span class="text-grey fs-2">[в разработке]</span>-->
                        <!--                        </p>-->
                        <p
                            class="fs-2 survey-form-object-preview-offer__advs"
                            :class="{ 'color-danger': advs.length === 0 }"
                        >
                            <i class="fa-solid fa-bullhorn mr-1"></i>
                            <span v-if="advs.length">{{ advsLabel }}</span>
                            <span v-else>Нет рекламы</span>
                        </p>
                        <p
                            v-if="offer.ad_special"
                            class="fs-2 survey-form-object-preview-offer__special"
                        >
                            Спецпредложение
                        </p>
                        <p
                            v-if="commercialOffer.built_to_suit === 1"
                            class="fs-1 font-weight-semi mt-1"
                        >
                            <span>{{ builtToSuitType }}</span>
                            <span v-if="commercialOffer.built_to_suit_time">
                                / {{ commercialOffer.built_to_suit_time }} мес.
                            </span>
                        </p>
                        <div class="survey-form-object-preview-offer__date text-grey">
                            Создан {{ createdAt }}
                        </div>
                    </div>
                </div>
                <div class="survey-form-object-preview-offer__info">
                    <div class="survey-form-object-preview-offer__top">
                        <div class="survey-form-object-preview-offer__description">
                            <p v-if="offer.description?.length">{{ offer.description }}</p>
                            <p v-else>Без описания..</p>
                        </div>
                        <div v-if="editable" class="survey-form-object-preview-offer__actions">
                            <UiButtonIcon
                                @click="selectAnswer(ANSWER.SUCCESS)"
                                :active="hasSuccessStatus"
                                :disabled
                                icon="fa-solid fa-thumbs-up"
                                label="Без изменений"
                            />
                            <UiButtonIcon
                                @click="selectAnswer(ANSWER.FAIL)"
                                :active="hasFailStatus"
                                :disabled
                                icon="fa-solid fa-thumbs-down"
                                label="Больше не актуально"
                                class="survey-form-object-preview-offer__action-negative"
                            />
                            <UiButtonIcon
                                @click="selectAnswer(ANSWER.EDIT)"
                                :active="needEditing"
                                :disabled
                                icon="fa-solid fa-pen"
                                label="Внести изменения"
                                class="survey-form-object-preview-offer__action-warning"
                            />
                        </div>
                    </div>
                    <div class="survey-form-object-preview-offer__row">
                        <div
                            class="survey-form-object-preview-offer__block survey-form-object-preview-offer__price"
                        >
                            <p class="fs-1">
                                <span>{{ priceTitle }}</span>
                                <span
                                    v-if="commercialOffer.tax_form"
                                    class="ml-1 text-success_alt font-weight-bold"
                                >
                                    {{ taxTitle }}
                                </span>
                            </p>
                            <WithUnitType
                                class="font-weight-bold survey-form-object-preview-offer__price-value"
                                :value="calculatedPrice"
                                :unit-type="unitTypes.RUB"
                            />
                            <template v-if="!passive">
                                <p
                                    v-if="commercialOffer.sale_company === 1"
                                    class="fs-1 text-primary"
                                >
                                    Продажа юр.лица
                                </p>
                                <p v-if="publicServices.length" class="fs-1 text-primary">
                                    Включая {{ publicServicesLabel }}
                                </p>
                            </template>
                        </div>
                        <SurveyFormObjectsPreviewOfferParameters
                            class="survey-form-object-preview-offer__block"
                            :object
                            :offer
                        />
                    </div>
                </div>
            </div>
            <AnimationTransition v-if="editable" :speed="0.5">
                <VueEditor
                    v-if="needEditing || hasFailStatus"
                    v-model="modelValue.description"
                    autofocus
                    :min-height="60"
                    :max-height="200"
                    :toolbar="false"
                    :disabled
                    placeholder="Что необходимо изменить или добавить?"
                    class="survey-form-object-preview-offer__editor mt-2 font-weight-bold"
                >
                    <template #after>
                        <p
                            :class="hasFailStatus ? 'text-danger' : 'text-warning'"
                            class="survey-form-object-preview-offer__editor-helper"
                        >
                            {{ editorHelper }}
                        </p>
                    </template>
                </VueEditor>
            </AnimationTransition>
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
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActionsTrigger from '@/components/common/UI/DropdownActions/UiDropdownActionsTrigger.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import Avatar from '@/components/common/Avatar.vue';
import { getApiFileNotFound } from '@/utils/url.js';
import { toDateFormat } from '@/utils/formatters/date.js';
import { useAuth } from '@/composables/useAuth.js';
import { useStore } from 'vuex';

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
    passive: Boolean,
    disabled: Boolean
});

const dealTypeName = computed(() => dealOptions.type[props.commercialOffer.deal_type]);

const visualId = computed(() => `#${props.object.id}-${dealTypeName.value[0]}`);

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

const advs = computed(() => {
    const row = [];

    if (props.offer.ad_avito) row.push('Avito');
    if (props.offer.ad_cian) row.push('ЦИАН');
    if (props.offer.ad_yandex) row.push('Яндекс');
    if (props.offer.ad_realtor) row.push('Raysarma');

    return row;
});

const advsLabel = computed(() => advs.value.join(', '));

// prices

const taxTitle = computed(() => dealOptions.tax[props.commercialOffer.tax_form]);

const publicServices = computed(() => {
    const services = [];

    if (props.commercialOffer.price_opex === 1) services.push('OPEX');
    if (props.commercialOffer.public_services === 1) services.push('КУ');

    return services;
});

const publicServicesLabel = computed(() => publicServices.value.join(', '));

const builtToSuitType = computed(() => {
    return props.commercialOffer.deal_type === dealOptions.typeStatement.SALE
        ? 'Built To Sale'
        : 'Built To Rent';
});

// TODO: Что за деление?

// form

const ANSWER = {
    SUCCESS: 1,
    FAIL: 2,
    EDIT: 3
};

function selectAnswer(value) {
    if (Number(modelValue.value.answer) === Number(value)) {
        modelValue.value.answer = 0;
    } else {
        modelValue.value.answer = Number(value);
    }

    emit('change');
}

const hasSuccessStatus = computed(() => Number(modelValue.value.answer) === ANSWER.SUCCESS);
const hasFailStatus = computed(() => Number(modelValue.value.answer) === ANSWER.FAIL);
const needEditing = computed(() => Number(modelValue.value.answer) === ANSWER.EDIT);

const hasStatus = computed(
    () => hasSuccessStatus.value || hasFailStatus.value || needEditing.value
);

const { consultantsOptions } = useConsultantsOptions();

const consultant = computed(() => {
    if (isNullish(props.commercialOffer.agent_id)) return null;

    return consultantsOptions.value.find(
        element => element.user_id_old === props.commercialOffer.agent_id
    );
});

const avatar = computed(() => {
    if (consultant.value) return 0;
    return getApiFileNotFound();
});

const createdAt = computed(() => toDateFormat(props.offer.publ_time * 1000, 'DD.MM.YYг.'));

const store = useStore();
const { currentUser } = useAuth();

const moderator = computed(() => store.getters.moderator);

const editorHelper = computed(() => {
    const postfix = `${currentUser.value.userProfile.short_name} > ${moderator.value?.short_name ?? 'Менеджер'}`;

    if (Number(modelValue.value.answer) === ANSWER.EDIT) return `Редактирование: ${postfix}`;
    return `Не актуально: ${postfix}`;
});
</script>
