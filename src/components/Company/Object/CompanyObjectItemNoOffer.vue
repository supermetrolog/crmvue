<template>
    <div>
        <DashboardCard
            class="offer-table-item-mobile offer-table-item-mobile--no-offer"
            :class="{
                passive: isPassive,
                general: offer.type_id === 2
            }"
        >
            <div class="offer-table-item-preview">
                <a
                    :href="offerOldUrl"
                    target="_blank"
                    class="button button--small offer-table-item__button"
                >
                    Старая версия
                </a>
                <div class="offer-table-item-preview__header mb-1">
                    <UiField v-if="isPassive" class="dashboard-bg-danger-l">Пассив</UiField>
                    <UiField v-else class="dashboard-bg-success-l">
                        {{ dealType }}
                    </UiField>
                    <UiField
                        v-if="offer.hide_from_market"
                        tooltip="Не выгружается"
                        class="dashboard-bg-warning-l"
                    >
                        <i class="fa-solid fa-eye-slash"></i>
                    </UiField>
                    <UiField
                        v-if="offer.class_name"
                        tooltip="Класс объекта"
                        class="dashboard-bg-danger-l"
                    >
                        {{ offer.class_name }}
                    </UiField>
                </div>
                <div class="offer-table-item-preview__container">
                    <LazyImage v-if="offer.image" :src="offer.image" />
                    <NoImage v-else />
                </div>
            </div>
            <div class="d-flex gap-1 my-1 position-relative">
                <UiField v-if="isPassive" class="dashboard-bg-warning text-white">
                    В архиве
                </UiField>
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
                <UiField v-if="offer.visual_id" color="light">
                    {{ offer.visual_id }}
                </UiField>
                <div class="offer-table-item-mobile__actions">
                    <a :href="offerUrl" target="_blank">
                        <UiButtonIcon
                            label="Открыть страницу предложения"
                            icon="fa-solid fa-eye"
                            class="offer-table-item-mobile__button"
                        />
                    </a>
                </div>
            </div>
            <div class="object-offer__block mb-1">
                <p class="object-offer__block-title">Адрес</p>
                <p>{{ offer.address ?? '-' }}</p>
            </div>
            <div class="row">
                <div class="col-6">
                    <div v-if="offer.area" class="offer-table-item-area">
                        <with-unit-type
                            :unit-type="unitTypes.SQUARE_METERS"
                            class="offer-table-item-area__title"
                        >
                            {{ offer.area }}
                        </with-unit-type>
                    </div>
                </div>
                <div class="col-6">
                    <div v-if="offer.price" class="offer-table-item-price">
                        <div class="font-weight-bold">
                            <with-unit-type :unit-type="unitTypes.RUB_PER_SQUARE_METERS">
                                {{ offer.price }}
                            </with-unit-type>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="offer.comments?.length" class="row">
                <div class="col-12">
                    <hr />
                    <div class="object-offer__comments">
                        <UiField class="dashboard-bg-light mx-auto mb-1"> Комментарии: </UiField>
                        <p
                            v-for="comment in offer.comments"
                            :key="comment.id"
                            class="object-offer__comment"
                            :class="{ current: comment.timeline_step_id === currentStepID }"
                        >
                            {{ comment.comment }}
                        </p>
                    </div>
                </div>
            </div>
        </DashboardCard>
    </div>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { getLinkOfferByObject, getLinkOfferOldByObject } from '@/utils/url.js';
import NoImage from '@/components/common/NoImage.vue';
import LazyImage from '@/components/common/LazyImage.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import UiField from '@/components/common/UI/UiField.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

const props = defineProps({
    offer: {
        type: Object
    },
    currentStepID: {
        type: Number,
        required: true
    }
});

const isPassive = computed(() => {
    return props.offer.status !== 1;
});

const dealType = computed(() => dealOptions.type[props.offer.deal_type]);
const offerUrl = computed(() => getLinkOfferByObject(props.offer));
const offerOldUrl = computed(() => getLinkOfferOldByObject(props.offer));
</script>
