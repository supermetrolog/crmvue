<template>
    <Modal
        @close="$emit('close')"
        show
        :title="'Просмотр оборудования #' + equipment.id"
        width="1200"
    >
        <div class="dashboard-card-view">
            <div class="row">
                <div class="col-12">
                    <DashboardCard
                        :class="{
                            'dashboard-bg-danger-l': isPassive
                        }"
                    >
                        <div class="dashboard-card-view__header">
                            <h3 v-if="equipment.name">{{ equipment.name }}</h3>
                            <DashboardChip class="ml-md-2" :class="statusClass">
                                <div class="d-flex align-items-center">
                                    <p>{{ isPassive ? 'Пассив' : 'Актив' }}</p>
                                    <i
                                        v-if="isPassive"
                                        v-tippy="statusTippy"
                                        class="fa-regular fa-question-circle ml-2 icon"
                                    />
                                </div>
                            </DashboardChip>
                            <DashboardChip
                                v-if="equipment.benefit"
                                class="dashboard-bg-danger dashboard-cl-white"
                            >
                                <div class="d-flex align-items-center">
                                    <i class="fa-solid fa-sack-dollar icon"></i>
                                    <span class="ml-2">Выгодное предложение</span>
                                </div>
                            </DashboardChip>
                            <div class="dashboard-card-view__actions">
                                <HoverActionsButton
                                    @click="$emit('called')"
                                    label="Обновить последний звонок"
                                >
                                    <i class="fa-solid fa-phone" />
                                </HoverActionsButton>
                                <template v-if="canEdit">
                                    <HoverActionsButton
                                        @click="$emit('edit')"
                                        label="Редактировать"
                                    >
                                        <i class="fa-solid fa-pen" />
                                    </HoverActionsButton>
                                    <HoverActionsButton
                                        @click="$emit('toggle-passive')"
                                        :label="isPassive ? 'Восстановить' : 'Отправить в пассив'"
                                    >
                                        <i
                                            class="fa-solid"
                                            :class="isPassive ? 'fa-rotate-right' : 'fa-ban'"
                                        ></i>
                                    </HoverActionsButton>
                                </template>
                                <HoverActionsButton
                                    v-if="canRemove"
                                    @click="$emit('remove')"
                                    label="Удалить"
                                >
                                    <i class="fa-solid fa-trash" />
                                </HoverActionsButton>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
                <div class="col-md-8 col-12">
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle">
                            Фотографии ({{ equipment.photos?.length ?? 0 }})
                        </p>
                        <Carousel
                            v-if="equipment.photos?.length"
                            :title="equipment.name"
                            :slides="photos"
                        />
                        <EmptyData v-else>Список фотографий пуст..</EmptyData>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle">Адрес</p>
                        <p>{{ equipment.address ?? 'Не заполнен' }}</p>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <div class="row">
                            <div class="col-md-3 col-6">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Создано</p>
                                    <p>{{ $formatter.toDate(equipment.created_at) }}</p>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Обновлено</p>
                                    <p>{{ lastUpdateDate }}</p>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Последний звонок</p>
                                    <p>{{ lastCallDate }}</p>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Дата архивации</p>
                                    <p>{{ archivedDate }}</p>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                    <DashboardCard>
                        <p class="dashboard-card-view__subtitle">Описание</p>
                        <div class="dashboard-card-view__description">
                            <div
                                v-if="equipment.description?.length"
                                v-html="equipment.description"
                            ></div>
                            <p v-else>Не заполнено</p>
                        </div>
                    </DashboardCard>
                </div>
                <div class="col-md-4 col-12">
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">О компании</p>
                        <CompanyElement :company="equipment.company" class="mb-2" />
                        <CompanyContact :contact="equipment.contact" />
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Консультант</p>
                        <div class="d-flex align-items-center">
                            <Avatar :src="equipment.consultant?.userProfile?.avatar" size="40" />
                            <span class="ml-2">
                                {{ equipment.consultant?.userProfile?.medium_name }}
                            </span>
                        </div>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Характеристики</p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Категория:</span>
                            <span>{{ category }}</span>
                        </p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Состояние:</span>
                            <span>{{ state }}</span>
                        </p>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Наличие и цена</p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Наличие:</span>
                            <span>{{ availability }}</span>
                        </p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Количество:</span>
                            <with-unit-type v-if="equipment.count" :unit-type="unitTypes.PIECES">
                                {{ $formatter.number(equipment.count) }}
                            </with-unit-type>
                            <span v-else>не указано</span>
                        </p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Цена:</span>
                            <with-unit-type v-if="equipment.price" :unit-type="unitTypes.RUB">
                                {{ $formatter.number(equipment.price) }}
                            </with-unit-type>
                            <span v-else>не указано</span>
                            <span v-if="equipment.tax">, {{ tax }}</span>
                        </p>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Доставка</p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Наличие доставки:</span>
                            <span>{{ delivery }}</span>
                        </p>
                        <p v-if="equipment.delivery === 1" class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Цена доставки:</span>
                            <with-unit-type
                                v-if="equipment.deliveryPrice"
                                :unit-type="unitTypes.RUB"
                            >
                                {{ $formatter.number(equipment.deliveryPrice) }}
                            </with-unit-type>
                            <span v-else>не указано</span>
                        </p>
                    </DashboardCard>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script setup>
import CompanyElement from '@/components/Company/CompanyElement.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Avatar from '@/components/common/Avatar.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import Carousel from '@/components/common/Carousel.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import EmptyData from '@/components/common/EmptyData.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed } from 'vue';
import { equipmentOptions } from '@/const/options/equipment.options.js';
import { toDateFormat } from '@/utils/formatters/date.ts';

defineEmits(['close', 'edit', 'toggle-passive', 'called', 'remove']);
const props = defineProps({
    equipment: {
        type: Object,
        required: true
    },
    canEdit: {
        type: Boolean,
        default: false
    },
    canRemove: {
        type: Boolean,
        default: false
    }
});

const isPassive = computed(
    () => props.equipment.status === equipmentOptions.statusStatement.PASSIVE
);

const statusClass = computed(() => {
    if (isPassive.value) return 'dashboard-bg-danger-l';
    return 'dashboard-bg-success-l';
});

const statusTippy = computed(() => {
    let text = equipmentOptions.passiveType[props.equipment.passive_type];
    if (props.equipment.passive_comment) text += ': ' + props.equipment.passive_comment;
    return text;
});

const lastCallDate = computed(() => {
    if (!props.equipment.last_call) return 'Отсутствует';
    return toDateFormat(props.equipment.last_call.created_at);
});

const lastUpdateDate = computed(() => {
    if (props.equipment.updated_at) return toDateFormat(props.equipment.updated_at);
    return 'Не обновлялось';
});

const archivedDate = computed(() => {
    if (isPassive.value && props.equipment.archived_at)
        return toDateFormat(props.equipment.archived_at);
    return 'Активно';
});

const photos = computed(() => props.equipment.photos.map(el => ({ src: el })));

const availability = computed(() => {
    if (props.equipment.availability)
        return equipmentOptions.availability[props.equipment.availability];
    return 'не указано';
});

const category = computed(() => {
    if (props.equipment.category) return equipmentOptions.category[props.equipment.category];
    return 'не указано';
});

const state = computed(() => {
    if (props.equipment.state) return equipmentOptions.usedStatus[props.equipment.state];
    return 'не указано';
});

const delivery = computed(() => {
    if (props.equipment.delivery) return equipmentOptions.delivery[props.equipment.delivery];
    return 'не указано';
});

const tax = computed(() => {
    return equipmentOptions.tax[props.equipment.tax];
});
</script>
