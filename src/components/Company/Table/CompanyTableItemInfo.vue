<template>
    <div>
        <a class="company-table-item__title" :href="companyUrl" target="_blank">
            <h4 :class="{ 'text-warning': isPassive, 'op-5 text-danger text-through': isDeleted }">
                <UiTooltipIcon
                    v-if="company.is_individual"
                    tooltip="Физ.лицо"
                    icon="fa-solid fa-user-tie"
                    class="mr-1"
                />
                <span>{{ companyName }}</span>
            </h4>
        </a>
        <p v-if="company.companyGroup" class="company-table-item__company-group">
            {{ company.companyGroup.full_name }}
        </p>
        <span v-if="company.activity_profiles?.length" class="company-table-item__profile">
            {{ activityProfile }}
        </span>
        <div v-if="company.productRanges?.length" class="company-table-item__product-ranges my-1">
            <DashboardChip
                v-for="productRange in company.productRanges"
                :key="productRange.id"
                class="dashboard-bg-light company-table-item__product-range"
            >
                {{ ucFirst(productRange.product) }}
            </DashboardChip>
        </div>
        <Rating v-if="company.rating" :rating="company.rating" color="yellow" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ActivityProfileList } from '@/const/const.js';
import Rating from '@/components/common/Rating.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { getLinkCompany } from '@/utils/url.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { ucFirst } from '@/utils/formatters/string.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { CompanyStatusEnum } from '@/types/company';

const props = defineProps({
    company: { type: Object, required: true }
});

const activityProfile = computed(() =>
    props.company.activity_profiles
        .map(el => ActivityProfileList[el.activity_profile_id].label)
        .join(', ')
);

const isPassive = computed(() => props.company.status === CompanyStatusEnum.PASSIVE);
const isDeleted = computed(() => props.company.status === CompanyStatusEnum.DELETED);

const companyUrl = computed(() => getLinkCompany(props.company.id));
const companyName = computed(() => getCompanyName(props.company));
</script>
