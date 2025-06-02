<template>
    <div class="survey-form-object-preview">
        <div class="survey-form-object-preview__header">
            <p class="survey-form-object-preview__address">
                <i class="fa-solid fa-map-location-dot mr-1" />
                <span>{{ object.address }}</span>
            </p>
        </div>
        <hr />
        <SurveyFormObjectsPreviewSlider @show-preview="$emit('show-preview', $event)" :object />
        <hr />
        <div>
            <div class="survey-form-object-preview__tabs">
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.ACTIVE">
                    <i class="fa-solid fa-up-long mr-1" />
                    <span>Актив ({{ activeTradeOffers.length }})</span>
                </SurveyFormObjectsPreviewTab>
                <span>|</span>
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.PASSIVE">
                    <i class="fa-solid fa-down-long mr-1" />
                    <span>Пассив ({{ passiveTradeOffers.length }})</span>
                </SurveyFormObjectsPreviewTab>
                <template v-if="completedTradeOffers.length">
                    <span>|</span>
                    <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.COMPLETED">
                        {{ completedTradeOffersTitle }}
                    </SurveyFormObjectsPreviewTab>
                </template>
                <span>|</span>
                <UiButton @click="addNewOffer" mini color="light" icon="fa-solid fa-plus">
                    Добавить предложение
                </UiButton>
                <div class="d-flex gap-1 ml-auto">
                    <UiButtonIcon
                        @click="modelValue.answer = 1"
                        :active="modelValue.answer == 1"
                        icon="fa-solid fa-check"
                        label="Обработано"
                        small
                    />
                    <UiButtonIcon
                        @click="modelValue.answer = 2"
                        :active="modelValue.answer == 2"
                        icon="fa-solid fa-thumbs-up"
                        label="Без изменений"
                        small
                    />
                    <UiButtonIcon
                        @click="modelValue.answer = 3"
                        :active="modelValue.answer == 3"
                        icon="fa-solid fa-phone-slash"
                        label="Не опрашивал"
                        small
                    />
                </div>
            </div>
            <div v-if="modelValue.current" class="survey-form-object-preview__content">
                <div v-if="currenTab === TABS.ACTIVE">
                    <div
                        v-if="activeTradeOffers.length || modelValue.created?.length"
                        class="survey-form-object-preview__list"
                    >
                        <SurveyFormObjectsPreviewNewOffer
                            v-for="offer in modelValue.created"
                            :key="offer.id"
                            v-model="offer.description"
                            @edit="editNewOffer(offer)"
                            @delete="deleteNewOffer(offer)"
                            :offer="offer"
                            editable
                        />
                        <hr
                            v-if="modelValue.created?.length && activeTradeOffers.length"
                            class="w-100"
                        />
                        <SurveyFormObjectsPreviewOffer
                            v-for="tradeOffer in activeTradeOffers"
                            :key="tradeOffer.id"
                            v-model="modelValue.current[tradeOffer.id]"
                            :offer="tradeOffer"
                            :commercial-offer="commercialOffersByIdMap[tradeOffer.offer_id]"
                            :object
                            editable
                        />
                    </div>
                    <EmptyData v-else class="mt-2">
                        Список активных торговых предложений пуст..
                    </EmptyData>
                </div>
                <div v-show="currenTab === TABS.PASSIVE">
                    <div v-if="passiveTradeOffers.length" class="survey-form-object-preview__list">
                        <SurveyFormObjectsPreviewOffer
                            v-for="tradeOffer in passiveTradeOffers"
                            :key="tradeOffer.id"
                            v-model="modelValue.current[tradeOffer.id]"
                            :offer="tradeOffer"
                            :commercial-offer="commercialOffersByIdMap[tradeOffer.offer_id]"
                            :object
                            passive
                        />
                    </div>
                    <EmptyData v-else class="mt-2">
                        Список архивных торговых предложений пуст..
                    </EmptyData>
                </div>
                <div v-if="completedTradeOffers.length" v-show="currenTab === TABS.COMPLETED">
                    <div class="survey-form-object-preview__list">
                        <SurveyFormObjectsPreviewOffer
                            v-for="tradeOffer in completedTradeOffers"
                            :key="tradeOffer.id"
                            v-model="modelValue.current[tradeOffer.id]"
                            :offer="tradeOffer"
                            :commercial-offer="commercialOffersByIdMap[tradeOffer.offer_id]"
                            :object
                            passive
                        />
                    </div>
                </div>
            </div>
        </div>
        <teleport to="body">
            <SurveyFormObjectsPreviewOfferForm
                v-if="formIsVisible"
                @close="closeForm"
                @created="onCreatedOffer"
                @updated="onUpdatedOffer"
                :form-data="editingNewOffer"
            />
        </teleport>
    </div>
</template>
<script setup>
import { computed, markRaw, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import SurveyFormObjectsPreviewOffer from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOffer.vue';
import { extractDeepProperty } from '@/utils/helpers/object/extractDeepProperty.js';
import EmptyData from '@/components/common/EmptyData.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import SurveyFormObjectsPreviewTab from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewTab.vue';
import SurveyFormObjectsPreviewSlider from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewSlider.vue';
import SurveyFormObjectsPreviewNewOffer from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewNewOffer.vue';
import SurveyFormObjectsPreviewOfferForm from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOfferForm.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import { floorOptions } from '@/const/options/floor.options.js';

const modelValue = defineModel({ type: Object });

defineEmits(['show-preview']);
const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const activeTradeOffers = shallowRef([]);
const passiveTradeOffers = shallowRef([]);
const completedTradeOffers = shallowRef([]);

const commercialOffersByIdMap = shallowRef({});

const completedTradeOffersTitle = computed(() => `Сделки (${completedTradeOffers.value.length})`);

function getOfferGatesCount(offer) {
    if (offer.gates?.length) {
        let count = 0;

        for (let i = 1; i < offer.gates.length; i += 2) {
            count += Number(offer.gates[i]);
        }

        return count;
    }

    return 0;
}

function getOfferFloorTypesCount(offer) {
    if (props.object.is_land) {
        if (offer.floor_types_land.length > 1) {
            return `Разные (${offer.floor_types_land.length})`;
        }

        if (offer.floor_types_land.length) {
            return floorOptions.floorTypes[offer.floor_types_land[0]];
        }

        return '-';
    }

    if (offer.floor_types.length > 1) {
        return `Разные (${offer.floor_types.length})`;
    }

    if (offer.floor_types.length) {
        return floorOptions.floorTypes[offer.floor_types[0]];
    }

    return '-';
}

function extractTradeOffers() {
    const commercialOfferByIdMap = {};

    for (const commercialOffer of props.object.commercialOffers) {
        commercialOfferByIdMap[commercialOffer.id] = commercialOffer;
    }

    commercialOffersByIdMap.value = commercialOfferByIdMap;

    const tradeOffers = extractDeepProperty(props.object, 'commercialOffers.blocks');

    const activeOffers = [];
    const passiveOffers = [];
    const completedOffers = [];

    if (!('current' in modelValue.value)) {
        modelValue.value.current = {};
    }

    if (!('created' in modelValue.value)) {
        modelValue.value.created = [];
    }

    if (!('arendators' in modelValue.value)) {
        modelValue.value.arendators = [];
    }

    for (const offer of tradeOffers) {
        if (!offer.deleted && !offer.deal_id) {
            activeOffers.push(offer);

            if (isNullish(modelValue.value.current[offer.id])) {
                modelValue.value.current[offer.id] = {
                    answer: null,
                    description: null,
                    offer_id: offer.id,
                    snapshot: markRaw({
                        deal_type: commercialOfferByIdMap[offer.offer_id].deal_type,
                        is_land: props.object.is_land,
                        area: toNumberOrRangeFormat(offer.area_min, offer.area_max),
                        price: props.object.is_land
                            ? toNumberOrRangeFormat(offer.price_sale_min, offer.price_sale_max)
                            : toNumberOrRangeFormat(offer.price_floor_min, offer.price_floor_max),
                        floors: new Set(offer.floor.filter(el => Number(el) > 0)).size,
                        ceiling: toNumberOrRangeFormat(
                            offer.ceiling_height_min,
                            offer.ceiling_height_max
                        ),
                        gates: getOfferGatesCount(offer),
                        power: Number(offer.power),
                        cranes: offer.cranes?.length ?? 0,
                        floor_types: getOfferFloorTypesCount(offer)
                    })
                };
            }

            continue;
        }

        if (offer.deleted && !offer.deal_id) {
            passiveOffers.push(offer);
            continue;
        }

        if (offer.deal_id) {
            completedOffers.push(offer);
        }
    }

    activeTradeOffers.value = activeOffers;
    passiveTradeOffers.value = passiveOffers;
    completedTradeOffers.value = completedOffers;
}

watch(() => props.object.id, extractTradeOffers, { immediate: true });

// tabs

const TABS = {
    ACTIVE: 'active',
    PASSIVE: 'passive',
    COMPLETED: 'completed'
};

const currenTab = ref(TABS.ACTIVE);

// form

const formIsVisible = ref(false);
const editingNewOffer = shallowRef(null);

function editNewOffer(offer) {
    editingNewOffer.value = offer;
    formIsVisible.value = true;
}

function deleteNewOffer(offer) {
    spliceById(modelValue.value.created, offer.id);
    if (modelValue.value.created.length === 0) {
        currenTab.value = TABS.ACTIVE;
    }
}

function addNewOffer() {
    formIsVisible.value = true;
}

function closeForm() {
    formIsVisible.value = false;
    editingNewOffer.value = null;
}

function onCreatedOffer(offer) {
    modelValue.value.created.push(offer);
    formIsVisible.value = false;
}

function onUpdatedOffer(offer) {
    Object.assign(editingNewOffer.value, offer);

    editingNewOffer.value = null;
    formIsVisible.value = false;
}

// check progress before unmount

function markProgress() {
    if (isNotNullish(modelValue.value.answer)) return;

    const answers = Object.values(modelValue.value.current);

    if (answers.length === 0) return;

    const allOffersAnswered = answers.every(
        answer => isNotNullish(answer.answer) && Number(answer.answer) !== 0
    );

    if (allOffersAnswered) {
        modelValue.value.answer = 1;
    }
}

onBeforeUnmount(markProgress);
</script>
