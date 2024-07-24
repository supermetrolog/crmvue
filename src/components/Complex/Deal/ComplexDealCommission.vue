<template>
    <div class="deal-info__block deal-info-commission">
        <p class="deal-info__block-title">Комиссия</p>
        <ul class="deal-info-commission__list">
            <ComplexDealCommissionItem
                v-if="!!commissions.commission_owner"
                label="Комиссия от собственника"
                cancel-label="Собственник не платит"
                :cancel="commissionOwnerCanceled"
            >
                <span>{{ toNumberFormat(commissions.commission_owner_value) }}%</span>
                <span v-if="commissionOwnerType">, {{ commissionOwnerType }}</span>
            </ComplexDealCommissionItem>
            <ComplexDealCommissionItem
                v-if="!!commissions.commission_client"
                label="Комиссия от клиента"
                cancel-label="Клиент не платит"
                :cancel="commissionClientCanceled"
            >
                {{ toNumberFormat(commissions.commission_client_value) }}%
            </ComplexDealCommissionItem>
            <ComplexDealCommissionItem
                v-if="!!commissions.commission_agent"
                label="Комиссия агенту"
                cancel-label="Агенту не платят"
                :cancel="commissionAgentCanceled"
            >
                {{ toNumberFormat(commissions.commission_agent_value) }}%
            </ComplexDealCommissionItem>
        </ul>
    </div>
</template>
<script setup>
import { entityOptions } from '@/const/options/options';
import ComplexDealCommissionItem from '@/components/Complex/Deal/ComplexDealCommissionItem.vue';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatter.js';

const props = defineProps({
    commissions: {
        type: Object,
        required: true
    }
});

const commissionOwnerType = computed(() => {
    if (props.commissions.commission_owner)
        return entityOptions.deal.commissionOwner[props.commissions.commission_owner_type];

    return null;
});
const commissionOwnerCanceled = computed(() => {
    return props.commissions.commission_owner === entityOptions.deal.commissionStatement.CANCELED;
});
const commissionClientCanceled = computed(() => {
    return props.commissions.commission_client === entityOptions.deal.commissionStatement.CANCELED;
});
const commissionAgentCanceled = computed(() => {
    return props.commissions.commission_agent === entityOptions.deal.commissionStatement.CANCELED;
});
</script>
