<template>
    <div>
        <ul class="company-box-main__list">
            <CompanyBoxRow label="Вебсайт">
                <div v-if="websites.length" class="company-box-main__vertical-list">
                    <a
                        v-for="website in websites"
                        :key="website"
                        :href="toCorrectUrl(website)"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {{ website }}
                    </a>
                </div>
            </CompanyBoxRow>
            <CompanyBoxRow label="Группа деятельности">
                <span v-if="hasActivityGroup">
                    {{ activityGroups }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Профиль деятельности">
                <span v-if="hasActivityProfile">
                    {{ activityProfiles }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow v-if="company.show_product_ranges" label="Номенклатура товара">
                <span v-if="company.productRanges?.length">
                    {{ productRanges }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Внес">
                <span v-if="company.consultant">
                    {{ company.consultant.userProfile.short_name }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Поступление">
                <span v-if="company.created_at">
                    {{ createdAt }}
                </span>
            </CompanyBoxRow>
            <CompanyBoxRow label="Обновление">
                <span v-if="company.updated_at">
                    {{ updatedAt }}
                </span>
            </CompanyBoxRow>
        </ul>
    </div>
</template>

<script setup>
import { ActivityGroupList, ActivityProfileList } from '@/const/const';
import { computed } from 'vue';
import CompanyBoxRow from '@/components/Company/Box/CompanyBoxRow.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { toDateFormat } from '@/utils/formatters/date.ts';
import { toCorrectUrl } from '@/utils/formatters/string.js';

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const productRanges = computed(() => {
    return props.company.productRanges
        .map(range => range.product[0].toUpperCase() + range.product.slice(1))
        .join(', ');
});

const websites = computed(() => {
    let commonContact = props.company.generalContact;
    if (commonContact) return commonContact.websites.map(item => item.website);
    return [];
});

const createdAt = computed(() => toDateFormat(props.company.created_at, 'DD.MM.YYYY'));
const updatedAt = computed(() => toDateFormat(props.company.updated_at, 'DD.MM.YYYY'));

const hasActivityGroup = computed(() => isNotNullish(props.company.activity_groups?.length));
const hasActivityProfile = computed(() => isNotNullish(props.company.activity_profiles?.length));

const activityGroups = computed(() => {
    return props.company.activity_groups
        .map(el => ActivityGroupList[el.activity_group_id].label)
        .join(', ');
});

const activityProfiles = computed(() => {
    return props.company.activity_profiles
        .map(el => ActivityProfileList[el.activity_profile_id].label)
        .join(', ');
});
</script>
