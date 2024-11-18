<template>
    <div class="timeline-deal">
        <DashboardCard class="dashboard-card-view">
            <template #header>
                <div class="timeline-deal__header">
                    <DashboardChip class="dashboard-bg-light">Сделка #{{ deal.id }}</DashboardChip>
                    <DashboardChip
                        :class="deal.is_our === 1 ? 'dashboard-bg-light' : 'dashboard-bg-danger-l'"
                    >
                        {{ dealOwner }}
                    </DashboardChip>
                    <p class="timeline-deal__title">{{ deal.name }}</p>
                </div>
            </template>
            <div class="row">
                <div class="col-7">
                    <div class="row">
                        <div class="col-6">
                            <DashboardCard class="mb-2">
                                <p class="dashboard-card-view__subtitle mb-2">Подробности</p>
                                <p class="dashboard-card-view__property">
                                    <span class="dashboard-card-view__category">Компания:</span>
                                    <span>
                                        <a :href="$url.company(deal.company_id)">
                                            {{ $formatter.companyName(deal.company) }}
                                        </a>
                                    </span>
                                </p>
                                <p class="dashboard-card-view__property">
                                    <span class="dashboard-card-view__category">Юр. лицо:</span>
                                    <span v-if="deal.clientLegalEntity">
                                        {{ deal.clientLegalEntity_full_name }}
                                    </span>
                                    <span v-else>-</span>
                                </p>
                                <p class="dashboard-card-view__property">
                                    <span class="dashboard-card-view__category"
                                        >Срок контракта:</span
                                    >
                                    <span v-if="deal.contractTerm"
                                        >{{ deal.contractTerm }} мес.</span
                                    >
                                    <span v-else>не указано</span>
                                </p>
                            </DashboardCard>
                        </div>
                        <div class="col-6">
                            <DashboardCard class="mb-2">
                                <p class="dashboard-card-view__subtitle mb-2">Характеристики</p>
                                <p class="dashboard-card-view__property">
                                    <span class="dashboard-card-view__category">Площадь:</span>
                                    <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                        {{ toNumberFormat(deal.area) }}
                                    </with-unit-type>
                                </p>
                                <p class="dashboard-card-view__property">
                                    <span class="dashboard-card-view__category">Цена за пол:</span>
                                    <with-unit-type :unit-type="unitTypes.RUB">
                                        {{ toNumberFormat(deal.floorPrice) }}
                                    </with-unit-type>
                                </p>
                            </DashboardCard>
                        </div>
                    </div>
                    <DashboardCard class="mb-2">
                        <div class="row">
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Совершено</p>
                                    <p>{{ deal.dealDate_format }}</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Создано</p>
                                    <p>{{ $formatter.toDate(deal.created_at) }}</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="dashboard-card-view__block">
                                    <p class="dashboard-card-view__helper">Обновлено</p>
                                    <p v-if="deal.updated_at">
                                        {{ $formatter.toDate(deal.updated_at) }}
                                    </p>
                                    <p v-else>-</p>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Описание</p>
                        <div v-if="deal.description" v-html="deal.description"></div>
                        <p v-else>-</p>
                    </DashboardCard>
                </div>
                <div class="col-5">
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Объект сделки</p>
                        <OfferTableMobileItem v-if="deal.offer" :offer="deal.offer" />
                        <p v-else>-</p>
                    </DashboardCard>
                    <DashboardCard class="mb-2">
                        <p class="dashboard-card-view__subtitle mb-2">Консультант</p>
                        <div class="d-flex align-items-center">
                            <Avatar :src="deal.consultant.userProfile.avatar" size="40" />
                            <span class="ml-2">
                                {{ deal.consultant.userProfile.medium_name }}
                            </span>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </DashboardCard>
    </div>
</template>
<script setup>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Avatar from '@/components/common/Avatar.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import OfferTableMobileItem from '@/components/Offer/OfferTableMobileItem.vue';
import { computed } from 'vue';
import { getCompanyName, toNumberFormat } from '@/utils/formatter.js';
import { unitTypes } from '@/const/unitTypes.js';

const props = defineProps({
    deal: {
        type: Object,
        required: true
    }
});

const dealOwner = computed(() => {
    if (props.deal.is_our) return 'RAYS ARMA';
    else
        return 'Конкурент: ' + props.deal.competitor
            ? getCompanyName(props.deal.competitor, props.deal.competitor_company_id)
            : 'не указан';
});
</script>
