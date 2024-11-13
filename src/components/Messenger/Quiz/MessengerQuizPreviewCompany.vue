<template>
    <a v-tippy="'Нажмите, чтобы открыть компанию'" :href="companyUrl" target="blank">
        <DashboardChip class="dashboard-bg-success-l text-dark" with-icon>
            <span v-if="name">{{ name }} (#{{ company.company_id }})</span>
            <span v-else class="d-flex align-items-center">
                <Spinner v-if="loading" class="mini mr-1" />
                <span>Компания #{{ company.company_id }}</span>
            </span>
            <template v-if="company.area">
                <i class="fa-solid fa-arrow-right"></i>
                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                    {{ area }}
                </WithUnitType>
            </template>
            <i class="fa-solid fa-up-right-from-square"></i>
        </DashboardChip>
    </a>
</template>
<script setup>
import { computed } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { getLinkCompany } from '@/utils/url.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { toNumberFormat } from '@/utils/formatter.js';
import Spinner from '@/components/common/Spinner.vue';

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    name: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const companyUrl = computed(() => getLinkCompany(props.company.company_id));
const area = computed(() => toNumberFormat(props.company.area));
</script>
