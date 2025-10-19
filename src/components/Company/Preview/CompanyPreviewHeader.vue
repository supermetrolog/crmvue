<template>
    <div class="company-preview__header">
        <UiChip v-if="isPassive || isDeleted" color="danger">
            <span>{{ isPassive ? 'Приостановлена' : 'Удалена' }}</span>
            <i v-tippy="statusTippy" class="fa-regular fa-question-circle" />
        </UiChip>
        <UiChip>#{{ company.id }}</UiChip>
        <UiChip v-for="category in categories" :key="category.id" color="dark">
            {{ category.label }}
        </UiChip>
        <UiChip v-for="group in activityGroups" :key="group.id" color="dark">
            {{ group.label }}
        </UiChip>
        <UiChip v-for="profile in activityProfiles" :key="profile.id" color="dark">
            {{ profile.label }}
        </UiChip>
        <UiChip v-for="productRange in productRanges" :key="productRange.id" color="dark">
            {{ productRange.label }}
        </UiChip>
        <UiChip v-if="company.consultant" color="warning">
            <i class="fa-solid fa-person-arrow-up-from-line" />
            <span>{{ company.consultant.userProfile.medium_name }}</span>
        </UiChip>
        <CompanyPreviewRating :rating="company.rating" />
    </div>
</template>

<script setup>
import {
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories,
    PassiveWhy
} from '@/const/const.js';
import { computed } from 'vue';
import UiChip from '@/components/common/UI/UiChip.vue';
import CompanyPreviewRating from '@/components/Company/Preview/CompanyPreviewRating.vue';
import { CompanyStatusEnum } from '@/types/company';

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const categories = computed(() => {
    return props.company.categories.map(item => ({
        id: item.id,
        label: CompanyCategories[item.category]
    }));
});

const activityGroups = computed(() =>
    props.company.activity_groups.map(el => ({
        id: el.id,
        label: ActivityGroupList[el.activity_group_id].label
    }))
);
const activityProfiles = computed(() =>
    props.company.activity_profiles.map(el => ({
        id: el.id,
        label: ActivityProfileList[el.activity_profile_id].label
    }))
);

const productRanges = computed(() => {
    return props.company.productRanges.map((range, index) => ({
        id: index,
        label: range.product[0].toUpperCase() + range.product.slice(1)
    }));
});

const isPassive = computed(() => props.company.status === CompanyStatusEnum.PASSIVE);
const isDeleted = computed(() => props.company.status === CompanyStatusEnum.DELETED);

const statusTippy = computed(() => {
    let text = PassiveWhy[props.company.passive_why].label;
    if (props.company.passive_why_comment) text += ': ' + props.company.passive_why_comment;
    return text;
});
</script>
