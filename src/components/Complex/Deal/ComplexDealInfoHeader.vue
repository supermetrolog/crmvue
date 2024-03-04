<template>
    <div class="deal-info-header">
        <ComplexDealInfoSpecials v-if="hasSpecials" :specials="specials" />
        <span v-else></span>
        <div class="deal-info-header__agent">
            <span class="deal-info-header__username">{{ consultantName }}</span>
            <div v-if="visited" class="deal-info-header__visit">
                <i class="fas fa-walking"></i>
                <span>Личное посещение</span>
            </div>
        </div>
    </div>
</template>

<script>
import ComplexDealInfoSpecials from '@/components/Complex/Deal/ComplexDealInfoSpecials.vue';
import { entityOptions } from '@/const/options/options';

export default {
    name: 'ComplexDealInfoHeader',
    components: { ComplexDealInfoSpecials },
    props: {
        consultant: {
            type: Object,
            default: () => {}
        },
        visited: {
            type: Boolean,
            default: false
        },
        specials: {
            type: Object,
            default: () => null
        }
    },
    computed: {
        hasSpecials() {
            return this.specials.built_to_suit === entityOptions.defaults.booleanStatement.TRUE;
        },
        consultantName() {
            return this.consultant.userProfile.full_name;
        }
    }
};
</script>
