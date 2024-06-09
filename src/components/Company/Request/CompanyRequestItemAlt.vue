<template>
    <div class="company-request-item-alt p-3">
        <div class="row">
            <div class="col-12">
                <DashboardCard>
                    <div class="dashboard-card-view__header">
                        <strong class="mr-2">
                            #{{ request.id }}
                            <span v-if="request.name">, {{ request.name }}</span>
                        </strong>
                        <DashboardCardRequestStatus :request="request" />
                        <DashboardChip
                            v-if="request.expressRequest"
                            class="dashboard-bg-danger dashboard-cl-white"
                        >
                            Срочный запрос
                        </DashboardChip>
                        <DashboardChip class="dashboard-bg-light">
                            {{ dealType }}
                        </DashboardChip>
                        <DashboardChip v-if="request.heated !== null" class="dashboard-bg-light">
                            {{ temperature }}
                        </DashboardChip>
                        <div class="dashboard-card-view__actions">
                            <HoverActionsButton
                                v-if="!readOnly"
                                @click="$emit('start-editing')"
                                label="Редактировать"
                            >
                                <i class="fa-solid fa-pen" />
                            </HoverActionsButton>
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
                    <p class="dashboard-card-view__subtitle mb-2">Характеристики</p>
                    <p class="dashboard-card-view__property">
                        <span class="dashboard-card-view__category">Высота потолка:</span>
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
                        <span class="dashboard-card-view__category">Площадь пола:</span>
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
                        <span class="dashboard-card-view__category">Электричество:</span>
                        <with-unit-type v-if="request.electricity" :unit-type="unitTypes.KILOWATT">
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
                    <div class="dashboard-card-view__property">
                        <span class="dashboard-card-view__category">Дата переезда:</span>
                        <p>
                            {{
                                request.unknownMovingDate
                                    ? unknownMovingTitle
                                    : $formatter.toDate(request.movingDate)
                            }}
                        </p>
                    </div>
                </DashboardCard>
                <DashboardCard class="mb-2">
                    <p class="dashboard-card-view__subtitle mb-2">Класс объекта</p>
                    <div v-if="request.objectClasses.length" class="d-flex flex-wrap gap-1">
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
</template>

<script>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { entityOptions } from '@/const/options/options.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import DashboardCardRequestObjectTypes from '@/components/Dashboard/Card/DashboardCardRequestObjectTypes.vue';
import DashboardCardRequestRequirements from '@/components/Dashboard/Card/DashboardCardRequestRequirements.vue';
import DashboardCardRequestAddress from '@/components/Dashboard/Card/DashboardCardRequestAddress.vue';
import DashboardCardRequestStatus from '@/components/Dashboard/Card/DashboardCardRequestStatus.vue';
import { unknownMovingDate } from '@/const/const.js';

export default {
    name: 'CompanyRequestItemAlt',
    components: {
        DashboardCardRequestStatus,
        DashboardCardRequestAddress,
        DashboardCardRequestRequirements,
        DashboardCardRequestObjectTypes,
        WithUnitType,
        DashboardChip,
        DashboardCard,
        HoverActionsButton
    },
    emits: ['start-editing'],
    props: {
        request: {
            type: Object
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        editOnly: {
            type: Boolean,
            default: false
        },
        withDeal: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        dealType() {
            return entityOptions.deal.type[Number(this.request.dealType) + 1];
        },
        temperature() {
            if (this.request.heated === 0) return 'Холодный';
            if (this.request.heated === 1) return 'Отапливаемый';
            return null;
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
        }
    }
};
</script>
