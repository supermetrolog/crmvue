<template>
    <div>
        <DashboardCard
            class="offer-table-item-mobile"
            :class="{
                passive: isPassive,
                selected: isSelected,
                general: offer.type_id === 2,
                'animated-background': isNewRecommended
            }"
        >
            <OfferTableItemPreview
                @click-preview="select"
                :is-passive="isPassive"
                :offer="offer"
                as="div"
                class="mb-1"
            />
            <div
                v-if="isSelected"
                @click.prevent="$emit('unselect', offer)"
                class="offer-table-item-mobile__unselect"
            >
                <i class="fas fa-check" />
            </div>
            <div class="d-flex gap-1 mb-1 position-relative">
                <UiField
                    v-if="offer.duplicate_count > 1"
                    tooltip="Количество отправлений"
                    class="dashboard-bg-warning"
                >
                    <i class="fa-regular fa-paper-plane"></i>
                    <span>{{ offer.duplicate_count }}</span>
                </UiField>
                <UiField
                    v-if="offer.type_id === 2"
                    class="offer-table-item-mobile__block dashboard-bg-primary text-white"
                >
                    Общий
                </UiField>
                <UiField
                    v-else-if="offer.type_id === 1"
                    class="offer-table-item-mobile__block dashboard-bg-primary-l"
                >
                    Блок
                </UiField>
                <UiField
                    v-else
                    class="offer-table-item-mobile__block dashboard-bg-warning text-white"
                >
                    Неизвестно
                </UiField>
            </div>
            <div class="offer-table-item-mobile__header">
                <UiField class="dashboard-bg-light">
                    {{ offer.visual_id }}
                </UiField>
                <div class="offer-table-item-mobile__actions">
                    <a :href="offerUrl" target="_blank">
                        <UiButtonIcon
                            label="Открыть страницу предложения"
                            class="offer-table-item-mobile__button"
                            icon="fa-solid fa-eye"
                        />
                    </a>
                    <template v-if="offer.type_id !== 3">
                        <UiButtonIcon
                            @click="toggleFavorite"
                            class="offer-table-item-mobile__button"
                            :label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
                            :active="isFavorite"
                            icon="fa-solid fa-star"
                        />
                        <a :href="pdfUrl" target="_blank">
                            <UiButtonIcon
                                class="offer-table-item-mobile__button"
                                label="Открыть PDF"
                                icon="fa-solid fa-file-pdf"
                            />
                        </a>
                    </template>
                </div>
            </div>
            <UiForm v-if="isSelected" class="object-offer__form mb-2">
                <textarea
                    v-if="isSelected"
                    ref="commentEl"
                    v-model.trim="localComment"
                    @blur="unfocusTextarea"
                    @keypress.enter="enterTextarea"
                    class="form__textarea"
                    rows="3"
                    placeholder="Комментарий клиенту"
                />
            </UiForm>
            <div class="object-offer__location my-1">
                {{ location }}
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="offer-table-item-area">
                        <with-unit-type
                            :unit-type="unitTypes.SQUARE_METERS"
                            class="offer-table-item-area__title"
                        >
                            {{ offer.calc_area_general }}
                        </with-unit-type>
                        <div class="offer-table-item-area__additional">
                            <p class="offer-table-item-area__item">
                                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                    {{ offer.calc_area_mezzanine }}
                                </with-unit-type>
                                <span> - мезонин</span>
                            </p>
                            <p class="offer-table-item-area__item">
                                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                    {{ offer.calc_area_office }}
                                </with-unit-type>
                                <span> - офисы</span>
                            </p>
                            <p class="offer-table-item-area__item">
                                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                    {{ offer.calc_area_tech }}
                                </with-unit-type>
                                <span> - технич.</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div v-if="offer.deal_type" class="offer-table-item-price">
                        <div class="font-weight-bold">
                            <with-unit-type
                                v-if="offer.deal_type === 1 || offer.deal_type === 4"
                                :unit-type="unitTypes.RUB_PER_SQUARE_METERS"
                            >
                                {{ offer.calc_price_warehouse }}
                            </with-unit-type>
                            <with-unit-type
                                v-else-if="offer.deal_type === 2"
                                :unit-type="unitTypes.RUB_PER_SQUARE_METERS"
                            >
                                {{ offer.calc_price_sale }}
                            </with-unit-type>
                            <p v-else-if="offer.deal_type === 3">
                                {{ offer.calc_price_safe_pallet }} <small>руб за 1 п. м.</small>
                            </p>
                        </div>
                        <span v-if="taxForm" class="offer-table-item-price__additional">
                            {{ taxForm }}
                        </span>
                    </div>
                </div>
            </div>
            <AccordionSimple without-render class="mt-1">
                <template #title>
                    <AccordionSimpleTrigger>
                        <UiField class="offer-table-item-mobile__dropdown" color="light">
                            <div class="d-flex justify-content-center gap-2">
                                <span>Подробнее</span>
                                <AccordionSimpleTriggerIcon />
                            </div>
                        </UiField>
                    </AccordionSimpleTrigger>
                </template>
                <template #body>
                    <div class="py-1 offer-table-item-mobile__extra">
                        <OfferTableItemMobileAddress :offer="offer" class="mb-1" />
                        <UiField v-if="offer.from_mkad" class="w-100 text-center" color="light">
                            {{ offer.from_mkad }} <small>км от МКАД</small>
                        </UiField>
                        <hr />
                        <div v-if="offer.comments?.length" class="object-offer__comments">
                            <p v-if="offer.comments?.length" class="offer-table-item-mobile__label">
                                Комментарии
                            </p>
                            <p
                                v-for="comment in offer.comments"
                                :key="comment.id"
                                class="object-offer__comment"
                                :class="{ current: comment.timeline_step_id === currentStepID }"
                            >
                                {{ comment.comment }}
                            </p>
                            <hr />
                        </div>
                        <p class="offer-table-item-mobile__label">Параметры</p>
                        <div class="d-flex flex-column">
                            <CompanyObjectItemProperty title="Площадь объекта">
                                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                    {{ $formatter.number(offer.area_building) }}
                                </with-unit-type>
                            </CompanyObjectItemProperty>
                            <CompanyObjectItemProperty title="Этажи">
                                {{ offer.calc_floors }}
                            </CompanyObjectItemProperty>
                            <CompanyObjectItemProperty title="Потолки">
                                <with-unit-type :unit-type="unitTypes.METERS">
                                    {{ offer.calc_ceilingHeight }}
                                </with-unit-type>
                            </CompanyObjectItemProperty>
                            <CompanyObjectItemProperty title="Электричество">
                                <with-unit-type :unit-type="unitTypes.KILOWATT">
                                    {{ $formatter.number(offer.power_value) }}
                                </with-unit-type>
                            </CompanyObjectItemProperty>
                            <CompanyObjectItemProperty title="Тип ворот">
                                {{ offer.gate_type || '-' }}
                            </CompanyObjectItemProperty>
                            <CompanyObjectItemProperty title="Отапливаемый">
                                {{ offer.heated ? 'Да' : 'Нет' }}
                            </CompanyObjectItemProperty>
                            <CompanyObjectItemProperty title="Антипыль">
                                {{ offer.self_leveling ? 'Да' : 'Нет' }}
                            </CompanyObjectItemProperty>
                            <CompanyObjectItemProperty title="Краны">
                                {{ offer.has_cranes ? 'Да' : 'Нет' }}
                            </CompanyObjectItemProperty>
                            <CompanyObjectItemProperty title="От МКАД">
                                {{ offer.from_mkad }} <small>км</small>
                            </CompanyObjectItemProperty>
                        </div>
                        <p class="offer-table-item-mobile__label">Статус</p>
                        <UiField
                            v-if="offer.status === 1"
                            class="dashboard-bg-success-l w-100 text-center my-1"
                        >
                            Актив
                        </UiField>
                        <UiField
                            v-else
                            class="dashboard-bg-danger text-white w-100 text-center my-1"
                        >
                            Пассив
                        </UiField>
                        <p class="offer-table-item-mobile__label">Реклама</p>
                        <div class="offer-table-item-mobile__advertisements my-1">
                            <UiField color="light">Realtor.ru</UiField>
                            <UiField v-if="offer.ad_cian" color="light">Циан</UiField>
                            <UiField v-if="offer.ad_yandex" color="light">Яндекс</UiField>
                            <UiField v-if="offer.ad_avito" color="light">Авито</UiField>
                            <UiField v-if="offer.ad_free" color="light">Бесплатные</UiField>
                        </div>
                        <!--                        <p class="offer-table-item-mobile__label">Ручное описание</p>-->
                        <!--                        <div class="object-offer__block">-->
                        <!--                            <p>-->
                        <!--                                {{ offer.object.description || '—' }}-->
                        <!--                            </p>-->
                        <!--                        </div>-->
                        <!--                        <p class="offer-table-item-mobile__label">Авто описание</p>-->
                        <!--                        <div class="object-offer__block">-->
                        <!--                            <p>-->
                        <!--                                {{ offer.object.description_auto || '—' }}-->
                        <!--                            </p>-->
                        <!--                        </div>-->
                    </div>
                </template>
            </AccordionSimple>
        </DashboardCard>
    </div>
</template>

<script setup>
import { TaxFormList } from '@/const/const.js';
import { useStore } from 'vuex';
import { unitTypes } from '@/const/unitTypes.js';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import OfferTableItemMobileAddress from '@/components/Offer/TableItem/OfferTableItemMobileAddress.vue';
import OfferTableItemPreview from '@/components/Offer/TableItem/Preview/OfferTableItemPreview.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { computed, nextTick, onBeforeMount, ref, useTemplateRef } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { useRoute } from 'vue-router';
import { getLinkOfferByObject, getLinkPDF } from '@/utils/url.js';
import CompanyObjectItemProperty from '@/components/Company/Object/CompanyObjectItemProperty.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

const emit = defineEmits(['select', 'unselect', 'addComment', 'deleteFavoriteOffer']);
const props = defineProps({
    offer: {
        type: Object
    },
    isSelected: {
        type: Boolean,
        default: false
    },
    col: {
        type: String,
        default: 'col-4'
    },
    disabled: {
        type: Boolean,
        default: true
    },
    currentStepID: {
        type: Number,
        default: 0
    }
});

const store = useStore();
const route = useRoute();
const { currentUser } = useAuth();
const commentEl = useTemplateRef('commentEl');

const localComment = ref(null);

const isNewRecommended = computed(() => {
    const newRecommended = route.query.new_original_id;
    if (!newRecommended) return false;

    if (Array.isArray(newRecommended)) {
        return newRecommended.includes(props.offer.original_id.toString());
    }

    return Number(newRecommended) === props.offer.original_id;
});

const pdfUrl = computed(() => {
    return getLinkPDF(
        {
            type_id: 2,
            offer_id: props.offer.original_id,
            object_id: props.offer.object_id
        },
        currentUser.value.id
    );
});

const offerUrl = computed(() => {
    return getLinkOfferByObject(props.offer);
});

const taxForm = computed(() => {
    if (props.offer.generalOffersMix?.offer?.tax_form)
        return TaxFormList[props.offer.generalOffersMix.offer.tax_form - 1].label;
    return null;
});

const isFavorite = computed(() => {
    return store.state.Offers.favoritesOffersCache[props.offer.original_id];
});

const isPassive = computed(() => props.offer.status !== 1);
const location = computed(() => {
    return [
        props.offer.district_name,
        props.offer.region_name,
        props.offer.district_moscow_name,
        props.offer.direction_name
    ]
        .filter(Boolean)
        .join(' — ');
});

const select = () => {
    if (props.disabled || props.offer.type_id === 3) return;

    emit('select', props.offer);

    nextTick(() => {
        commentEl.value.focus();
    });
};

const enterTextarea = () => {
    commentEl.value.blur();
};

const unfocusTextarea = () => {
    emit('addComment', props.offer.id, localComment.value);
};

const toggleFavorite = async () => {
    if (!isFavorite.value) return await store.dispatch('ADD_FAVORITES_OFFER', props.offer);

    await store.dispatch('DELETE_FAVORITES_OFFERS', props.offer);
    emit('deleteFavoriteOffer', props.offer);
};

onBeforeMount(() => {
    if (props.offer.comment) localComment.value = props.offer.comment;
});
</script>

<style>
.animated-background {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
</style>
