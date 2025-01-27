<template>
    <div class="company-preview__header">
        <Tippy v-if="companyWarnings.length">
            <UiChip color="danger">
                <span>Необходимо заполнить!</span>
                <i class="fa-regular fa-circle-question" />
            </UiChip>
            <template #content>
                <div>
                    <p class="color-light">Необходимо заполнить ({{ companyWarnings.length }}):</p>
                    <p v-for="warning in companyWarnings" :key="warning.key">
                        - {{ warning.label }}
                    </p>
                </div>
            </template>
        </Tippy>
        <UiChip v-if="isPassive" color="danger">
            <span>Пассив</span>
            <i v-tippy="statusTippy" class="fa-regular fa-question-circle" />
        </UiChip>
        <UiChip>#{{ company.id }}</UiChip>
        <UiChip v-for="category in categories" :key="category.id" color="dark">
            {{ category.label }}
        </UiChip>
        <UiChip color="dark">{{ activityGroup }}</UiChip>
        <UiChip color="dark">{{ activityProfile }}</UiChip>
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
import { companyProperties } from '@/const/properties/company.properties.js';
import { Tippy } from 'vue-tippy';
import UiChip from '@/components/common/UI/UiChip.vue';
import CompanyPreviewRating from '@/components/Company/Preview/CompanyPreviewRating.vue';

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

const activityGroup = computed(() => ActivityGroupList[props.company.activityGroup].label);
const activityProfile = computed(() => ActivityProfileList[props.company.activityProfile].label);

const productRanges = computed(() => {
    return props.company.productRanges.map((range, index) => ({
        id: index,
        label: range.product[0].toUpperCase() + range.product.slice(1)
    }));
});

const isPassive = computed(() => !props.company.status);

const statusTippy = computed(() => {
    let text = PassiveWhy[props.company.passive_why].label;
    if (props.company.passive_why_comment) text += ': ' + props.company.passive_why_comment;
    return text;
});

const companyWarnings = computed(() => {
    return companyProperties.progressCharacteristics.reduce((acc, property) => {
        const isValid = property.validator(props.company[property.key], props.company);

        if (!isValid)
            acc.push({
                key: property.key,
                label: property.label
            });

        return acc;
    }, []);
});
</script>
