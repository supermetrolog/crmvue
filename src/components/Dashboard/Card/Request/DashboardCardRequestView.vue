<template>
    <Modal @close="$emit('close')" show :title="'Просмотр запроса #' + request.id" width="1200">
        <Spinner v-if="isLoading" />
        <div v-else class="dashboard-card-view">
            <div class="row">
                <div class="col-12">
                    <DashboardCard
                        :class="{
                            'dashboard-bg-danger-l': isDisabled,
                            'dashboard-bg-success-l': isCompleted
                        }"
                    >
                        <div class="dashboard-card-view__header">
                            <span v-if="request.name">{{ request.name }}; </span>
                            <span>
                                Запрос от
                                <b>{{ companyName }}</b>
                            </span>
                            <DashboardCardRequestStatus class="ml-2" :request="request" />
                            <DashboardChip
                                v-if="request.expressRequest"
                                class="dashboard-bg-danger dashboard-cl-white"
                            >
                                Срочный запрос
                            </DashboardChip>
                            <div class="dashboard-card-view__actions">
                                <HoverActionsButton
                                    v-if="editable"
                                    @click="$emit('edit')"
                                    label="Редактировать"
                                >
                                    <i class="fa-solid fa-pen" />
                                </HoverActionsButton>
                                <HoverActionsButton
                                    v-if="editable && !isCompleted"
                                    @click="$emit('toggle-disable')"
                                    :label="isDisabled ? 'Восстановить' : 'Завершить'"
                                >
                                    <i
                                        class="fa-solid"
                                        :class="isDisabled ? 'fa-rotate-right' : 'fa-ban'"
                                    ></i>
                                </HoverActionsButton>
                                <router-link
                                    :to="`/companies/${request.company_id}?request_id=${request.id}&consultant_id=${currentUser.id}&step=0`"
                                    target="_blank"
                                >
                                    <HoverActionsButton label="Открыть таймлайн">
                                        <i class="fa-solid fa-timeline"></i>
                                    </HoverActionsButton>
                                </router-link>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
                <div class="col-8">
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle">Адрес</p>
                        <DashboardCardRequestAddress :request="request" />
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <div class="row">
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Создано</p>
                                    <p>{{ $formatter.toDate(request.created_at) }}</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Обновлено</p>
                                    <p>
                                        {{
                                            request.updated_at
                                                ? $formatter.toDate(request.updated_at)
                                                : 'Не обновлялось'
                                        }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Дата переезда</p>
                                    <p>
                                        {{
                                            request.unknownMovingDate
                                                ? unknownMovingTitle
                                                : $formatter.toDate(request.movingDate)
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle">О таймлайне</p>
                        <div>
                            <p>{{ $formatter.text().ucFirst(request.format_name) }}</p>
                            <Progress class="mb-2" :percent="request.timeline_progress" />
                            <p>
                                <span class="dashboard-card-view__category">
                                    Последнее обновление:
                                </span>
                                <span>
                                    {{
                                        request.related_updated_at
                                            ? $formatter.toDate(request.related_updated_at)
                                            : 'Отсутствует'
                                    }}
                                </span>
                            </p>
                        </div>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle">Тип объекта</p>
                        <DashboardCardRequestObjectTypes :request="request" />
                    </DashboardCard>
                    <DashboardCard>
                        <p class="dashboard-card-view__subtitle">Описание</p>
                        <p>
                            {{ request.description?.length ? request.description : 'Не заполнено' }}
                        </p>
                    </DashboardCard>
                </div>
                <div class="col-4">
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">О компании</p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Компания:</span>
                            <span>{{ $formatter.companyName(request.company) }}</span>
                        </p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Контакт:</span>
                            <span v-if="contact">{{ contact.full_name }}</span>
                            <span v-else>Загрузка..</span>
                        </p>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Консультант</p>
                        <div class="d-flex align-items-center">
                            <Avatar :src="request.consultant.userProfile.avatar" size="40" />
                            <span class="ml-2">
                                {{ request.consultant.userProfile.medium_name }}
                            </span>
                        </div>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Характеристики</p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category"> Высота потолка: </span>
                            <span v-if="request.minCeilingHeight || request.maxCeilingHeight">
                                <with-unit-type :unit-type="unitTypes.METERS">
                                    <span v-if="request.minCeilingHeight">
                                        от {{ $formatter.number(request.minCeilingHeight) }}
                                    </span>
                                    <span v-if="request.maxCeilingHeight">
                                        до {{ $formatter.number(request.maxCeilingHeight) }}
                                    </span>
                                </with-unit-type>
                            </span>
                            <span v-else>не указано</span>
                        </p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category"> Площадь пола: </span>
                            <with-unit-type
                                v-if="request.minArea || request.maxArea"
                                :unit-type="unitTypes.SQUARE_METERS"
                            >
                                <span v-if="request.minArea">
                                    от {{ $formatter.number(request.minArea) }}
                                </span>
                                <span v-if="request.maxArea">
                                    до {{ $formatter.number(request.maxArea) }}
                                </span>
                            </with-unit-type>
                            <span v-else>не указано</span>
                        </p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category"> Электричество: </span>
                            <with-unit-type
                                v-if="request.electricity"
                                :unit-type="unitTypes.KILOWATT"
                            >
                                {{ $formatter.number(request.electricity) }}
                            </with-unit-type>
                            <span v-else>не указано</span>
                        </p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Цена:</span>
                            <with-unit-type
                                v-if="request.pricePerFloor"
                                :unit-type="
                                    request.dealType === 1
                                        ? unitTypes.RUB
                                        : unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
                                "
                            >
                                {{ $formatter.number(request.pricePerFloor) }}
                            </with-unit-type>
                            <span v-else>не указано</span>
                        </p>
                        <p class="dashboard-card-view__property">
                            <span class="dashboard-card-view__category">Типы ворот:</span>
                            <template v-if="request.gateTypes.length">
                                {{ gateTypes }}
                            </template>
                            <span v-else>не указано</span>
                        </p>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Класс объекта</p>
                        <div v-if="request.objectClasses.length" class="d-flex gap-1 flex-wrap">
                            <DashboardChip
                                v-for="(element, key) in objectClasses"
                                :key="key"
                                class="d-flex align-items-center"
                                :class="
                                    element.included
                                        ? 'dashboard-bg-success dashboard-cl-white'
                                        : 'dashboard-bg-gray-l'
                                "
                            >
                                <span>{{ element.name }}</span>
                            </DashboardChip>
                        </div>
                        <p v-else>Не заполнено</p>
                    </DashboardCard>
                    <DashboardCard>
                        <p class="dashboard-card-view__subtitle mb-2">Требования</p>
                        <DashboardCardRequestRequirements :request="request" />
                    </DashboardCard>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import Avatar from '@/components/common/Avatar.vue';
import { entityOptions } from '@/const/options/options.js';
import Progress from '@/components/common/Progress.vue';
import { unknownMovingDate } from '@/const/const.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import api from '@/api/api.js';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import Spinner from '@/components/common/Spinner.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { mapGetters } from 'vuex';
import { alg } from '@/utils/alg.js';
import DashboardCardRequestObjectTypes from '@/components/Dashboard/Card/Request/DashboardCardRequestObjectTypes.vue';
import DashboardCardRequestRequirements from '@/components/Dashboard/Card/Request/DashboardCardRequestRequirements.vue';
import DashboardCardRequestAddress from '@/components/Dashboard/Card/Request/DashboardCardRequestAddress.vue';
import DashboardCardRequestStatus from '@/components/Dashboard/Card/Request/DashboardCardRequestStatus.vue';

export default {
    name: 'DashboardCardRequestView',
    components: {
        DashboardCardRequestStatus,
        DashboardCardRequestAddress,
        DashboardCardRequestRequirements,
        DashboardCardRequestObjectTypes,
        WithUnitType,
        DashboardCard,
        Spinner,
        Modal,
        DashboardChip,
        Progress,
        Avatar,
        HoverActionsButton
    },
    mixins: [LoaderMixin],
    emits: ['close', 'edit'],
    props: {
        request: {
            type: Object,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            contact: null
        };
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        unknownMovingTitle() {
            return unknownMovingDate[this.request.unknownMovingDate];
        },
        gateTypes() {
            return this.request.gateTypes
                .map(element => entityOptions.floor.gate[element.gate_type + 1])
                .join(', ');
        },
        objectClasses() {
            const classes = Object.values(entityOptions.object.class).map(value => ({
                name: value
            }));

            this.request.objectClasses.forEach(
                element => (classes[element.object_class].included = true)
            );

            return classes;
        },
        isCompleted() {
            return this.request.status === 2;
        },
        isDisabled() {
            return this.request.status === 0;
        },
        companyName() {
            return alg.isNumeric(this.request.company.full_name)
                ? 'Компания №' + this.request.company.full_name
                : this.request.company.full_name;
        },
        ...mapGetters({ currentUser: 'THIS_USER' })
    },
    methods: {
        async fetchContact() {
            this.loadingState = true;

            const response = await api.contacts.getContacts(this.request.company_id);

            if (response.length) {
                this.contact = response.find(element => element.id === this.request.contact_id);
            }

            this.loadingState = false;
        }
    },
    created() {
        this.fetchContact();
    }
};
</script>
