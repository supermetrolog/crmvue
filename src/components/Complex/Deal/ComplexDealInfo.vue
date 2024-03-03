<template>
    <div class="deal-info">
        <ComplexDealInfoHeader
            v-if="deal.consultant"
            :consultant="deal.consultant"
            :specials="dealSpecials"
            :visited="agentVisited"
        />
        <div class="deal-info__body">
            <div class="deal-info__content">
                <ComplexDealDetailedInfo :deal="deal" class="deal-info__detailed-info" />
            </div>
            <div class="deal-info__aside">
                <ComplexDealDetails :deal="deal" />
                <ComplexDealOwner v-if="deal.companyRecord" :owner="deal.companyRecord" />
                <ComplexDealContract v-if="contractIsSigned" :type="deal.contract_is_signed_type" />
                <ComplexDealCommission v-if="hasCommissionsInfo" :commissions="commissions" />
                <ComplexDealDescription
                    v-if="deal.description && deal.description.length"
                    :description="deal.description"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ComplexDealDetailedInfo from '@/components/Complex/Deal/ComplexDealDetailedInfo.vue';
import ComplexDealInfoHeader from '@/components/Complex/Deal/ComplexDealInfoHeader.vue';
import ComplexDealDetails from '@/components/Complex/Deal/Details/ComplexDealDetails.vue';
import ComplexDealOwner from '@/components/Complex/Deal/ComplexDealOwner.vue';
import ComplexDealCommission from '@/components/Complex/Deal/ComplexDealCommission.vue';
import { entityProperties } from '@/const/properties/properties';
import { alg } from '@/utils/alg';
import ComplexDealContract from '@/components/Complex/Deal/ComplexDealContract.vue';
import { entityOptions } from '@/const/options/options';
import ComplexDealDescription from '@/components/Complex/Deal/ComplexDealDescription.vue';

export default {
    name: 'ComplexDealInfo',
    components: {
        ComplexDealDescription,
        ComplexDealContract,
        ComplexDealCommission,
        ComplexDealOwner,
        ComplexDealDetails,
        ComplexDealInfoHeader,
        ComplexDealDetailedInfo
    },
    provide() {
        return {
            dealType: this.deal.dealTypeRecord,
            dealTypeShort: this.deal.dealTypeRecord.title[0]
        };
    },
    props: {
        deal: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    computed: {
        commissions() {
            return alg.extractPropertiesFromObject(
                this.deal,
                entityProperties.deal.commissionsList
            );
        },
        hasCommissionsInfo() {
            return (
                this.deal.commission_owner ||
                this.deal.commission_client ||
                this.deal.commission_agent
            );
        },
        agentVisited() {
            return this.deal.agent_visited === entityOptions.defaults.booleanStatement.TRUE;
        },
        contractIsSigned() {
            return this.deal.contract_is_signed === entityOptions.deal.contractStatement.SIGNED;
        },
        dealSpecials() {
            return alg.extractPropertiesFromObject(this.deal, entityProperties.deal.specialsList);
        }
    }
};
</script>
