<template>
    <div class="deal-info-commission">
        <p class="deal-info-commission__header">Комиссия</p>
        <ul class="deal-info-commission__list">
            <ComplexDealCommissionItem
                v-if="!!commissions.commission_owner"
                label="Комиссия от собственника"
                cancel-label="Собственник не платит"
                :cancel="commissions.commission_owner === 2"
            >
                {{ commissions.commission_owner_value }}%, {{ commissionOwnerType }}
            </ComplexDealCommissionItem>
            <ComplexDealCommissionItem
                v-if="!!commissions.commission_client"
                label="Комиссия от клиента"
                cancel-label="Клиент не платит"
                :cancel="commissions.commission_client === 2"
            >
                {{ commissions.commission_client_value }}%
            </ComplexDealCommissionItem>
            <ComplexDealCommissionItem
                v-if="!!commissions.commission_agent"
                label="Комиссия агенту"
                cancel-label="Агенту не платят"
                :cancel="commissions.commission_agent === 2"
            >
                {{ commissions.commission_agent_value }}%
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
            type: Array,
            required: true
        }
    },
    computed: {
        commissionOwnerType() {
            if (this.commissions.commission_owner)
                return entityOptions.deal.commissionOwner[this.commissions.commission_owner_type];

            return null;
        }
    }
};
</script>
