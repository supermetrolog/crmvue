<template>
    <div>
        <div
            class="object-offer object-offer--only"
            :class="{
                general: offer.type_id === 2,
                passive: isPassive
            }"
        >
            <div class="row no-gutters object-offer__info">
                <div class="col-12 align-self-center">
                    <div class="object-offer__preview">
                        <div class="object-offer__chips">
                            <DashboardChip v-if="offer.deal_type_name" class="object-offer__chip">
                                {{ offer.deal_type_name }}
                            </DashboardChip>
                            <DashboardChip
                                v-else-if="isPassive"
                                class="object-offer__chip dashboard-bg-danger text-white"
                            >
                                Пассив
                            </DashboardChip>
                            <DashboardChip v-tippy="'Класс объекта'" class="object-offer__chip">
                                {{ offer.class_name }}
                            </DashboardChip>
                            <DashboardChip
                                v-if="offer.duplicate_count > 1"
                                v-tippy="'Количество отправлений'"
                                class="object-offer__duplicate"
                            >
                                {{ offer.duplicate_count }}
                            </DashboardChip>
                            <DashboardChip class="object-offer__chip ml-auto">
                                {{ offer.visual_id }}
                            </DashboardChip>
                        </div>
                        <span
                            v-if="offer.test_only"
                            class="object-offer__badge object-offer__test-only"
                        >
                            Тестовый лот
                        </span>
                        <span
                            v-if="offer.type_id === 2"
                            class="object-offer__badge object-offer__is-main"
                        >
                            Общий
                        </span>
                        <span
                            v-else-if="offer.type_id === 1"
                            class="object-offer__badge object-offer__is-block"
                        >
                            Блок
                        </span>
                        <span v-else class="object-offer__badge object-offer__is-undefined">
                            Неизвестно
                        </span>
                        <a @click.prevent class="object-offer__photo" href="#" target="_blank">
                            <VLazyImage :src="offer.thumb" alt="image" />
                        </a>
                    </div>
                </div>
                <div class="col-12 px-2 object-offer__content text-center">
                    <DashboardChip
                        v-if="isPassive"
                        class="dashboard-bg-warning text-white mx-auto mb-1"
                    >
                        В архиве
                    </DashboardChip>
                    <div class="object-offer__actions mb-2">
                        <a :href="$url.offerByObject(offer)" target="_blank">
                            <HoverActionsButton v-tippy="'Открыть страницу предложения'">
                                <i class="fa-solid fa-eye" />
                            </HoverActionsButton>
                        </a>
                    </div>
                </div>
                <div class="col-12 object-offer__content text-center">
                    <DashboardChip class="dashboard-bg-success-l mx-auto mb-1">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa-solid fa-ruble-sign" />
                            <with-unit-type :unit-type="unitTypes.RUB">
                                {{ offer.price }}
                            </with-unit-type>
                        </div>
                    </DashboardChip>
                    <DashboardChip class="dashboard-bg-success-l mx-auto mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa-solid fa-square-full" />
                            <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                {{ offer.area }}
                            </with-unit-type>
                        </div>
                    </DashboardChip>
                    <div class="object-offer__block mb-1">
                        <p class="object-offer__block-title">Адрес</p>
                        <p>{{ offer.address }}</p>
                    </div>
                    <template v-if="offer.comments?.length">
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
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import VLazyImage from 'v-lazy-image';

export default {
    name: 'CompanyObjectItemNoOffer',
    components: { VLazyImage, WithUnitType, HoverActionsButton, DashboardChip },
    props: {
        offer: {
            type: Object
        },
        currentStepID: {
            type: Number,
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        isPassive() {
            return this.offer.status !== 1;
        }
    }
};
</script>
