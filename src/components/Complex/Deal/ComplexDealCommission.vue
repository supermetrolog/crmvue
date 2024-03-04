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
                <span>{{ $formatter.number(commissions.commission_owner_value) }}%</span>
                <span v-if="commissionOwnerType">, {{ commissionOwnerType }}</span>
            </ComplexDealCommissionItem>
            <ComplexDealCommissionItem
                v-if="!!commissions.commission_client"
                label="Комиссия от клиента"
                cancel-label="Клиент не платит"
                :cancel="commissionClientCanceled"
            >
                {{ $formatter.number(commissions.commission_client_value) }}%
            </ComplexDealCommissionItem>
            <ComplexDealCommissionItem
                v-if="!!commissions.commission_agent"
                label="Комиссия агенту"
                cancel-label="Агенту не платят"
                :cancel="commissionAgentCanceled"
            >
                {{ $formatter.number(commissions.commission_agent_value) }}%
            </ComplexDealCommissionItem>
        </ul>
    </div>
</template>
<script>
import { entityOptions } from '@/const/options/options';
import ComplexDealCommissionItem from '@/components/Complex/Deal/ComplexDealCommissionItem.vue';

export default {
    name: 'ComplexDealCommission',
    components: { ComplexDealCommissionItem },
    props: {
        commissions: {
            type: Object,
            required: true
        }
    },
    computed: {
        commissionOwnerType() {
            if (this.commissions.commission_owner)
                return entityOptions.deal.commissionOwner[this.commissions.commission_owner_type];

            return null;
        },
        commissionOwnerCanceled() {
            return (
                this.commissions.commission_owner ===
                entityOptions.deal.commissionStatement.CANCELED
            );
        },
        commissionClientCanceled() {
            return (
                this.commissions.commission_client ===
                entityOptions.deal.commissionStatement.CANCELED
            );
        },
        commissionAgentCanceled() {
            return (
                this.commissions.commission_agent ===
                entityOptions.deal.commissionStatement.CANCELED
            );
        }
    }
};
</script>
