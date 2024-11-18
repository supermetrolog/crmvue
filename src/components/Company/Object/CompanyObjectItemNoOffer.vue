<template>
    <div>
        <DashboardCard
            class="offer-table-item-mobile"
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
                    <DashboardChip v-if="isPassive" class="dashboard-bg-danger-l"
                        >Пассив</DashboardChip
                    >
                    <DashboardChip v-else class="dashboard-bg-success-l">
                        {{ dealType }}
                    </DashboardChip>
                    <DashboardChip
                        v-if="offer.hide_from_market"
                        v-tippy="'Не выгружается'"
                        class="dashboard-bg-warning-l"
                    >
                        <i class="fa-solid fa-eye-slash"></i>
                    </DashboardChip>
                    <DashboardChip v-tippy="'Класс объекта'" class="dashboard-bg-danger-l">
                        {{ offer.class_name }}
                    </DashboardChip>
                </div>
                <div class="offer-table-item-preview__container">
                    <LazyImage v-if="offer.image" :src="offer.image" />
                    <NoImage v-else />
                </div>
            </div>
            <div class="d-flex gap-1 my-1 position-relative">
                <DashboardChip v-if="isPassive" class="dashboard-bg-warning text-white">
                    В архиве
                </DashboardChip>
                <DashboardChip
                    v-if="offer.duplicate_count > 1"
                    v-tippy="'Количество отправлений'"
                    class="dashboard-bg-warning"
                    with-icon
                >
                    <i class="fa-regular fa-paper-plane"></i>
                    <span>{{ offer.duplicate_count }}</span>
                </DashboardChip>
                <DashboardChip
                    v-if="offer.type_id === 2"
                    class="offer-table-item-mobile__block dashboard-bg-primary text-white"
                >
                    Общий
                </DashboardChip>
                <DashboardChip
                    v-else-if="offer.type_id === 1"
                    class="offer-table-item-mobile__block dashboard-bg-primary-l"
                >
                    Блок
                </DashboardChip>
                <DashboardChip
                    v-else
                    class="offer-table-item-mobile__block dashboard-bg-warning text-white"
                >
                    Неизвестно
                </DashboardChip>
            </div>
            <div class="offer-table-item-mobile__header">
                <DashboardChip class="dashboard-bg-light">
                    {{ offer.visual_id }}
                </DashboardChip>
                <div class="offer-table-item-mobile__actions">
                    <a :href="offerUrl" target="_blank">
                        <HoverActionsButton
                            v-tippy="'Открыть страницу предложения'"
                            class="offer-table-item-mobile__button"
                        >
                            <i class="fa-solid fa-eye" />
                        </HoverActionsButton>
                    </a>
                </div>
            </div>
            <div class="object-offer__block mb-1">
                <p class="object-offer__block-title">Адрес</p>
                <p>{{ offer.address }}</p>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="offer-table-item-area">
                        <with-unit-type
                            :unit-type="unitTypes.SQUARE_METERS"
                            class="offer-table-item-area__title"
                        >
                            {{ offer.area }}
                        </with-unit-type>
                    </div>
                </div>
                <div class="col-6">
                    <div class="offer-table-item-price">
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
                        <DashboardChip class="dashboard-bg-light mx-auto mb-1">
                            Комментарии:
                        </DashboardChip>
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
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { getLinkOfferByObject, getLinkOfferOldByObject } from '@/utils/url.js';
import NoImage from '@/components/common/NoImage.vue';
import LazyImage from '@/components/common/LazyImage.vue';
import { dealOptions } from '@/const/options/deal.options.js';

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
