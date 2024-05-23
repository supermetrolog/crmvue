<template>
    <Modal @close="$emit('close')" :title="'Просмотр оборудования #' + equipment.id" width="1200">
        <Spinner v-if="isLoading" />
        <div v-else class="dashboard-card-view">
            <div class="row">
                <div class="col-12">
                    <DashboardCard
                        :class="{
                            'dashboard-bg-danger-l': isPassive
                        }"
                    >
                        <div class="dashboard-card-view__header">
                            <h3 v-if="equipment.name">{{ equipment.name }}</h3>
                            <DashboardChip class="ml-2" :class="statusClass">
                                <div class="d-flex align-items-center">
                                    <p>{{ status }}</p>
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
                            <div v-if="editable" class="dashboard-card-view__actions">
                                <HoverActionsButton @click="$emit('edit')" label="Редактировать">
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
                            </div>
                        </div>
                    </DashboardCard>
                </div>
                <div class="col-8">
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
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Создано</p>
                                    <p>{{ $formatter.toDate(equipment.created_at) }}</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Обновлено</p>
                                    <p>
                                        {{
                                            equipment.updated_at
                                                ? $formatter.toDate(equipment.updated_at)
                                                : 'Не обновлялось'
                                        }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Дата архивации</p>
                                    <p>
                                        {{
                                            equipment.archived_at
                                                ? $formatter.toDate(equipment.equipment_at)
                                                : 'Активно'
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                    <DashboardCard>
                        <p class="dashboard-card-view__subtitle">Описание</p>
                        <p>
                            {{
                                equipment.description?.length
                                    ? equipment.description
                                    : 'Не заполнено'
                            }}
                        </p>
                    </DashboardCard>
                </div>
                <div class="col-4">
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
                                v-if="equipment.delivery_price"
                                :unit-type="unitTypes.RUB"
                            >
                                {{ $formatter.number(equipment.delivery_price) }}
                            </with-unit-type>
                            <span v-else>не указано</span>
                        </p>
                    </DashboardCard>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import CompanyElement from '@/components/Company/CompanyElement.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import dayjs from 'dayjs';
import Spinner from '@/components/common/Spinner.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Avatar from '@/components/common/Avatar.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import { PassiveWhyRequest } from '@/const/const.js';
import Carousel from '@/components/common/Carousel.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { entityOptions } from '@/const/options/options.js';
import EmptyData from '@/components/common/EmptyData.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'EquipmentCardView',
    components: {
        HoverActionsButton,
        EmptyData,
        WithUnitType,
        Carousel,
        Modal,
        DashboardChip,
        Avatar,
        DashboardCard,
        Spinner,
        CompanyContact,
        CompanyElement
    },
    mixins: [LoaderMixin],
    emits: ['close', 'edit', 'toggle-passive'],
    props: {
        equipment: {
            type: Object,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        lastCallDate() {
            if (!this.equipment.lastCall) return 'Неизвестно';
            return dayjs(this.equipment.lastCall).format('DD.MM.YYYY, HH:mm');
        },
        lastUpdateDate() {
            return dayjs(this.equipment.updated_at).format('DD.MM.YYYY, HH:mm');
        },
        isPassive() {
            return false;
        },
        status() {
            if (this.equipment.status === 1) return 'Актив';
            return 'Пассив';
        },
        statusClass() {
            if (this.equipment.status === 1) return 'dashboard-bg-success-l';
            return 'dashboard-bg-danger-l';
        },
        statusTippy() {
            let text = PassiveWhyRequest[this.equipment.passive_why].label;
            if (this.equipment.passive_why_comment)
                text += ': ' + this.equipment.passive_why_comment;
            return text;
        },
        photos() {
            return this.equipment.photos.map(el => ({
                src: el
            }));
        },
        availability() {
            if (this.equipment.availability)
                return entityOptions.equipment.availability[this.equipment.availability];
            return 'не указано';
        },
        category() {
            if (this.equipment.category)
                return entityOptions.equipment.category[this.equipment.category];
            return 'не указано';
        },
        state() {
            if (this.equipment.state)
                return entityOptions.equipment.usedStatus[this.equipment.state];
            return 'не указано';
        },
        delivery() {
            if (this.equipment.delivery)
                return entityOptions.equipment.delivery[this.equipment.delivery];
            return 'не указано';
        },
        tax() {
            return entityOptions.equipment.tax[this.equipment.tax];
        }
    }
};
</script>
