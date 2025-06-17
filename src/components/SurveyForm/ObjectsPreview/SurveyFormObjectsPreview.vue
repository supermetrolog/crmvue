<template>
    <div class="survey-form-object-preview">
        <UiAccordion v-if="parametersHasWarnings" class="survey-form-object-preview__panel">
            <template #trigger="{ toggle, opened }">
                <UiAccordionButton
                    @click="toggle"
                    :class="parametersClass"
                    :label="parametersTitle"
                    :opened="opened"
                    icon="fa-solid fa-exclamation-circle survey-form-object-preview__accordion-icon"
                    expand-class="ml-auto"
                    class="w-100 br-0"
                />
            </template>
            <template #body>
                <MessengerDialogObjectPreview
                    @changed-warnings="parametersHasWarnings = $event"
                    :object
                    :show-offers="false"
                >
                    <template #actions>
                        <UiButton
                            @click="parametersFormIsVisible = true"
                            mini
                            icon="fa-solid fa-pen"
                            color="light"
                            class="ml-auto"
                        >
                            Редактировать
                        </UiButton>
                    </template>
                </MessengerDialogObjectPreview>
            </template>
        </UiAccordion>
        <div class="pt-2">
            <div class="survey-form-object-preview__tabs">
                <span class="font-weight-bold">Предложения</span>
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.ACTIVE">
                    <i class="fa-solid fa-up-long mr-1" />
                    <span>Активные ({{ activeTradeOffers.length }})</span>
                </SurveyFormObjectsPreviewTab>
                <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.PASSIVE">
                    <i class="fa-solid fa-down-long mr-1" />
                    <span>Пассивные ({{ passiveTradeOffers.length }})</span>
                </SurveyFormObjectsPreviewTab>
                <template v-if="completedTradeOffers.length">
                    <SurveyFormObjectsPreviewTab v-model="currenTab" :name="TABS.COMPLETED">
                        {{ completedTradeOffersTitle }}
                    </SurveyFormObjectsPreviewTab>
                </template>
                <span @click="addNewOffer" class="survey-form-objects__link"> + Добавить </span>
                <div v-if="activeTradeOffers.length" class="d-flex gap-1 ml-auto">
                    <UiDropdownActions>
                        <template #trigger>
                            <UiButton color="light" class="py-0 px-1 op-7" mini>
                                <div class="d-flex align-items-center">
                                    <span class="fs-2">Отметить все как</span>
                                    <i class="fa-solid fa-ellipsis-h ml-2 fs-3" />
                                </div>
                            </UiButton>
                        </template>
                        <template #menu>
                            <UiDropdownActionsButton
                                @handle="markAll(1)"
                                icon="fa-solid fa-thumbs-up"
                                label="Без изменений"
                            />
                            <UiDropdownActionsButton
                                @handle="markAll(2)"
                                icon="fa-solid fa-thumbs-down"
                                label="Больше не актуально"
                            />
                        </template>
                    </UiDropdownActions>
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
                            @change="markProgress"
                            :offer="tradeOffer"
                            :commercial-offer="commercialOffersByIdMap[tradeOffer.offer_id]"
                            :object
                            editable
                        />
                    </div>
                    <div v-else class="d-flex justify-content-center gap-2 mt-4">
                        <UiButton
                            @click="isOffersNotFound = !isOffersNotFound"
                            :color="isOffersNotFound ? 'success' : 'success-light'"
                        >
                            <div class="d-flex gap-1">
                                <UiCheckbox
                                    disabled
                                    :checked="isOffersNotFound"
                                    class="no-events"
                                />
                                <span>Нет новых предложений</span>
                            </div>
                        </UiButton>
                        <UiButton
                            @click="addNewOffer"
                            color="success-light"
                            icon="fa-solid fa-plus"
                        >
                            Добавить предложение
                        </UiButton>
                    </div>
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
            <UiModal
                v-model:visible="parametersFormIsVisible"
                :width="800"
                title="Параметры объекта"
                :close-on-outside-click="false"
                :close-on-press-esc="false"
            >
                <UiTextarea
                    v-model="parametersDescription"
                    :min-height="150"
                    :max-height="400"
                    label="Комментарий"
                    placeholder="Укажите параметры для внесения.."
                    required
                />
                <template #actions>
                    <UiButton
                        @click="saveParameters"
                        icon="fa-solid fa-check"
                        color="success-light"
                        :loading="parametersIsLoading"
                        >Сохранить
                    </UiButton>
                    <UiButton
                        @click="parametersFormIsVisible = false"
                        icon="fa-solid fa-ban"
                        color="light"
                    >
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
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
import SurveyFormObjectsPreviewNewOffer from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewNewOffer.vue';
import SurveyFormObjectsPreviewOfferForm from '@/components/SurveyForm/ObjectsPreview/SurveyFormObjectsPreviewOfferForm.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import { floorOptions } from '@/const/options/floor.options.js';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';
import UiAccordionButton from '@/components/common/UI/Accordion/UiAccordionButton.vue';
import MessengerDialogObjectPreview from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreview.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import api from '@/api/api.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { useAuth } from '@/composables/useAuth.js';

const modelValue = defineModel({ type: Object });

defineEmits(['show-preview']);
const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    company: {
        type: Object,
        required: true
    },
    survey: {
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
        if (
            !offer.deleted &&
            !offer.deal_id &&
            commercialOfferByIdMap[offer.offer_id].company_id == props.company?.id
        ) {
            activeOffers.push(offer);

            if (isNullish(modelValue.value.current[offer.id])) {
                modelValue.value.current[offer.id] = {
                    answer: null,
                    description: null,
                    offer_id: offer.id,
                    snapshot: markRaw({
                        deal_type: commercialOfferByIdMap[offer.offer_id].deal_type,
                        area: toNumberOrRangeFormat(offer.area_min, offer.area_max),
                        price: props.object.is_land
                            ? toNumberOrRangeFormat(offer.price_sale_min, offer.price_sale_max)
                            : toNumberOrRangeFormat(offer.price_floor_min, offer.price_floor_max),
                        ceiling: toNumberOrRangeFormat(
                            offer.ceiling_height_min,
                            offer.ceiling_height_max
                        ),
                        load: toNumberOrRangeFormat(offer.load_floor_min, offer.load_floor_max),
                        temperature: offer.temperature,
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
    isOffersNotFound.value = false;
    formIsVisible.value = false;

    markProgress();
}

function onUpdatedOffer(offer) {
    Object.assign(editingNewOffer.value, offer);

    editingNewOffer.value = null;
    formIsVisible.value = false;
}

// check progress before unmount

const answers = computed(() => Object.values(modelValue.value.current));

function markProgress() {
    if (answers.value.length === 0) {
        modelValue.value.answer =
            modelValue.value.created?.length || isOffersNotFound.value ? 1 : null;

        return;
    }

    const allOffersAnswered = answers.value.every(
        answer => isNotNullish(answer.answer) && Number(answer.answer) !== 0
    );

    if (allOffersAnswered) {
        modelValue.value.answer = 1;
    } else {
        modelValue.value.answer = null;
    }
}

onBeforeUnmount(markProgress);

const notify = useNotify();

function markAll(value) {
    for (const offer of activeTradeOffers.value) {
        modelValue.value.current[offer.id].answer = value;
    }

    notify.success('Все предложения обработаны');
    markProgress();
}

const parametersHasWarnings = ref(true);

const parametersTitle = computed(() => {
    if (parametersHasWarnings.value) {
        return 'Строение имеет недочеты в заполнении!';
    }

    return 'Просмотреть параметры строения';
});

const parametersClass = computed(() => {
    if (parametersHasWarnings.value) {
        return 'text-danger bg-white survey-form-object__accordion';
    }

    return undefined;
});

const isOffersNotFound = ref(false);

watch(isOffersNotFound, value => {
    if (value) modelValue.value.answer = 1;
    else modelValue.value.answer = null;
});

// parameters

const parametersFormIsVisible = ref(false);
const parametersIsLoading = ref(false);
const parametersDescription = ref(null);

watch(parametersFormIsVisible, () => {
    parametersDescription.value = null;
});

const store = useStore();
const { currentUserId } = useAuth();

async function saveParameters() {
    if (isNullish(parametersDescription.value) || parametersDescription.value.length === 0) {
        notify.info('Пожалуйста, укажите параметры для внесения');
        return;
    }

    parametersIsLoading.value = true;

    try {
        const task = await api.task.create({
            title: `Внести данные о строении #${props.object.id} (комп. ${getCompanyShortName(props.company)})`,
            message: parametersDescription.value,
            user_id: store.getters.moderator?.id ?? currentUserId.value,
            relations: [
                { entity_type: 'survey', entity_id: props.survey.id },
                {
                    entity_type: 'company',
                    entity_id: props.company.id
                }
            ],
            start: dayjs().toDate(),
            end: dayjs().add(5, 'day').toDate()
        });

        notify.success('Задача на изменения создана');

        if (isArray(props.survey?.tasks)) {
            // eslint-disable-next-line vue/no-mutating-props
            props.survey.tasks.push(task);
        } else {
            // eslint-disable-next-line vue/no-mutating-props
            props.survey.tasks = [task];
        }
    } finally {
        parametersIsLoading.value = false;
        parametersFormIsVisible.value = false;
    }
}
</script>
