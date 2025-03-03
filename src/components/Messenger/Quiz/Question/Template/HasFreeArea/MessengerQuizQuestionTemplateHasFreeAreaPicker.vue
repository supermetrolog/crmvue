<template>
    <div v-if="isInitialized && isVisibility" class="messenger-quiz-form-offer-picker w-100">
        <Spinner v-if="isLoading" class="mini" center label="Поиск предложений по аренде.." />
        <template v-else-if="hasData">
            <DashboardChip class="dashboard-bg-light mb-1">
                Найдено {{ pluralOffersLabel }} и {{ pluralObjectsLabel }}.
            </DashboardChip>
            <DashboardChip v-if="actionLabel" class="dashboard-bg-warning-l mb-1">
                {{ actionLabel }}
            </DashboardChip>
            <Tabs
                v-if="editMode"
                nav-class="messenger-quiz-form-offer-picker__tabs"
                nav-item-link-class="messenger-quiz-form-offer-picker__tab"
            >
                <Tab :name="`Активная аренда (${offers.length})`">
                    <MessengerQuizQuestionAccordionList
                        v-if="offers.length"
                        :label="`Список предложений (${offers.length})`"
                        close-label="Скрыть список предложений"
                    >
                        <MessengerQuizQuestionTemplateHasFreeAreaPickerOffer
                            v-for="offer in offers"
                            :key="offer.id"
                            v-model="offersModelValue[offer.id].form"
                            @show-preview="openPreview(offer.object.photo ?? [])"
                            @click="toggleOffer(offer.id)"
                            :offer="offer"
                            :active="disabled || offersModelValue[offer.id].form.disabled"
                            :disabled
                            :edit-mode
                            :passive-mode
                        />
                    </MessengerQuizQuestionAccordionList>
                    <DashboardChip v-else class="dashboard-bg-light" with-icon>
                        <i class="fa-solid fa-ban"></i>
                        <span>У компании нет активных предложений по аренде.</span>
                    </DashboardChip>
                </Tab>
                <Tab :name="`Другие объекты (${objects.length})`">
                    <template v-if="objects.length">
                        <AnimationTransition :speed="0.4">
                            <DashboardChip v-if="withRelated" class="dashboard-bg-warning-l mb-1">
                                Выберите объекты, на которых появилась площадь.
                            </DashboardChip>
                            <DashboardChip v-else class="dashboard-bg-warning-l mb-1" with-icon>
                                <i class="fa-solid fa-warning" />
                                <span>
                                    Чтобы заполнить вопрос для других объектов собственника,
                                    активируйте пункт выше.
                                </span>
                            </DashboardChip>
                        </AnimationTransition>
                        <MessengerQuizQuestionAccordionList
                            :label="`Список объектов (${objects.length})`"
                            close-label="Скрыть список объектов"
                        >
                            <MessengerQuizQuestionTemplateHasFreeAreaPickerObject
                                v-for="object in objects"
                                :key="object.id"
                                v-model="objectsModelValue[object.id].answer"
                                @show-preview="openPreview(object.photo ?? [])"
                                @click="toggleObject(object.id)"
                                :object="object"
                                :active="objectsModelValue[object.id].selected"
                                :disabled="disabled || !withRelated"
                                :question
                                :ignored-effects
                            />
                        </MessengerQuizQuestionAccordionList>
                    </template>
                    <DashboardChip v-else class="dashboard-bg-light" with-icon>
                        <i class="fa-solid fa-ban"></i>
                        <span>У компании нет занесенных объектов.</span>
                    </DashboardChip>
                </Tab>
            </Tabs>
            <MessengerQuizQuestionAccordionList
                v-else
                :label="`Список предложений (${offers.length})`"
                close-label="Скрыть список предложений"
            >
                <MessengerQuizQuestionTemplateHasFreeAreaPickerOffer
                    v-for="offer in offers"
                    :key="offer.id"
                    v-model="offersModelValue[offer.id].form"
                    @show-preview="openPreview(offer.object.photo ?? [])"
                    @click="toggleOffer(offer.id)"
                    :offer="offer"
                    :active="disabled || offersModelValue[offer.id].form.disabled"
                    :disabled
                    :edit-mode
                    :passive-mode
                />
            </MessengerQuizQuestionAccordionList>
        </template>
        <DashboardChip v-else class="dashboard-bg-light" with-icon>
            <i class="fa-solid fa-ban"></i>
            <span>У компании нет активных предложений по аренде.</span>
            <span v-if="editMode"> Других объектов в собственности нет.</span>
        </DashboardChip>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Spinner from '@/components/common/Spinner.vue';
import plural from 'plural-ru';
import MessengerQuizQuestionTemplateHasFreeAreaPickerOffer from '@/components/Messenger/Quiz/Question/Template/HasFreeArea/MessengerQuizQuestionTemplateHasFreeAreaPickerOffer.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import MessengerQuizQuestionTemplateHasFreeAreaPickerObject from '@/components/Messenger/Quiz/Question/Template/HasFreeArea/MessengerQuizQuestionTemplateHasFreeAreaPickerObject.vue';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { getLinkFile } from '@/utils/url.js';
import { useStore } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerQuizQuestionAccordionList from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionAccordionList.vue';
import { messenger } from '@/const/messenger.js';

const offersModelValue = defineModel('offers');
const objectsModelValue = defineModel('objects');

const props = defineProps({
    disabled: Boolean,
    companyId: {
        type: Number,
        required: true
    },
    editMode: Boolean,
    passiveMode: Boolean,
    mainAnswer: Boolean,
    withRelated: Boolean,
    question: {
        type: Object,
        required: true
    },
    ignoredEffects: {
        type: Set,
        default: null
    }
});

const store = useStore();

const currentObject = computed(() => {
    if (store.state.Messenger.currentDialogType === messenger.dialogTypes.OBJECT)
        return store.state.Messenger.currentDialog.model;
    return null;
});

const isLoading = ref(true);
const isInitialized = ref(false);

const offers = shallowRef([]);
const objects = shallowRef([]);

const hasData = computed(() => {
    if (props.editMode) return offers.value.length > 0 || objects.value.length > 0;
    return offers.value.length;
});

const pluralOffersLabel = computed(() => {
    return plural(offers.value.length, '%d предложение', '%d предложения', '%d предложений');
});

const pluralObjectsLabel = computed(() => {
    return plural(objects.value.length, '%d объект', '%d объекта', '%d объектов');
});

async function fetchOffersAndObjects() {
    isLoading.value = true;

    const [offersResponse, objectsResponse] = await Promise.allSettled([
        fetchOffers(),
        fetchObjects()
    ]);

    if (offersResponse?.value?.data?.length) {
        offers.value = offersResponse.value.data;
        initOffersModelValue(offers.value);
    }

    if (objectsResponse?.value?.data?.length > 1) {
        const filteredObjects = isNotNullish(currentObject.value)
            ? objectsResponse.value.data.filter(object => object.id !== currentObject.value.id)
            : objectsResponse.value.data;

        objects.value = filteredObjects;
        initObjectsModelValue(filteredObjects);
    }

    isLoading.value = false;
}

async function fetchOffers() {
    return api.offers.search({
        company_id: props.companyId,
        type_id: [2, 3],
        status: 1,
        deal_type: 0,
        expand:
            'contact.emails,contact.phones,' +
            'object,' +
            'company.mainContact.phones,company.mainContact.emails,company.objects_count,company.requests_count,company.active_contacts_count,' +
            'offer,' +
            'consultant.userProfile',
        'per-page': 0
    });
}

async function fetchObjects() {
    return api.object.list({ company_id: props.companyId });
}

const isVisibility = computed(() => isNotNullish(props.mainAnswer));

onMounted(() => {
    isInitialized.value = true;
    fetchOffersAndObjects();
});

// form

function setValue(value) {
    // selectedRequestsSet.value.clear();
    //
    // if (value.archived?.length) {
    //     modelValue.value.archived = [...value.archived];
    // } else {
    //     modelValue.value.archived = [];
    // }
    //
    // if (value.actual?.length) {
    //     value.actual.forEach(id => {
    //         selectRequest(id);
    //     });
    // }
}

defineExpose({ setValue });

// data

function initOffersModelValue(payload) {
    offersModelValue.value = payload.reduce((acc, element) => {
        acc[element.id] = {
            visual_id: element.visual_id,
            id: element.id,
            form: {
                disabled: false,
                action: null,
                comment: null
            }
        };

        return acc;
    }, {});
}

function initObjectsModelValue(payload) {
    objectsModelValue.value = payload.reduce((acc, element) => {
        acc[element.id] = {
            id: element.id,
            selected: false,
            answer: {
                description:
                    props.question.answers['text-answer']?.reduce((acc, el) => {
                        acc[el.id] = null;
                        return acc;
                    }, {}) ?? {},
                tab:
                    props.question.answers.tab?.reduce((acc, el) => {
                        acc[el.id] = null;
                        return acc;
                    }, {}) ?? {},
                main:
                    props.question.answers['yes-no']?.reduce((acc, el) => {
                        acc[el.id] = false;
                        return acc;
                    }, {}) ?? {}
            }
        };

        return acc;
    }, {});
}

function toggleOffer(id) {
    if (!props.disabled && props.passiveMode)
        offersModelValue.value[id].form.disabled = !offersModelValue.value[id].form.disabled;
}

function toggleObject(id) {
    objectsModelValue.value[id].selected = !objectsModelValue.value[id].selected;
}

const actionLabel = computed(() => {
    if (props.passiveMode) return 'Выберите предложения, которые необходимо отправить в пассив.';
    if (props.editMode)
        return 'Укажите, какие предложения необходимо отредактировать, а какие отправить в пассив.';
    return null;
});

// preview

const { preview } = usePreviewer();

function openPreview(photos) {
    preview(photos.map((photo, key) => ({ src: getLinkFile(photo), id: key })));
}
</script>
