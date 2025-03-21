<template>
    <Tr class="company-table-item" :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }">
        <Td class="text-center company-table-item__id">
            <p class="mb-1">{{ company.id }}</p>
        </Td>
        <Td class="company-table-item__name" sort="nameRu">
            <div class="company-table-item__main">
                <CompanyLogo
                    :company-id="company.id"
                    :company-name="companyName"
                    :src="company.logo"
                />
                <div>
                    <a class="company-table-item__title" :href="companyUrl" target="_blank">
                        <h4 :class="{ 'text-warning': isPassive }">
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
                    <span
                        v-if="company.activity_profiles?.length"
                        class="company-table-item__profile"
                    >
                        {{ activityProfile }}
                    </span>
                    <div
                        v-if="company.productRanges?.length"
                        class="company-table-item__product-ranges my-1"
                    >
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
            </div>
        </Td>
        <Td class="company-table-item__categories">
            <div v-if="company.categories.length" class="company-table-item__list">
                <DashboardChip
                    v-for="(category, key) in categories"
                    :key="key"
                    class="dashboard-bg-light"
                >
                    {{ category }}
                </DashboardChip>
            </div>
            <p v-else>&#8212;</p>
        </Td>
        <Td class="company-table-item__contacts">
            <CompanyContact
                v-if="company.mainContact"
                @open-phone="openInSurvey"
                hidden
                :contact="company.mainContact"
            />
            <p v-else class="text-center">&#8212;</p>
        </Td>
        <Td class="text-center company-table-item__survey"><span>&#8212;</span></Td>
        <Td class="company-table-item__consultant">
            <div v-if="company.consultant" class="company-table-item__consultant-wrapper">
                <Avatar
                    :label="company.consultant.userProfile.medium_name"
                    :src="company.consultant.userProfile.avatar"
                    :size="55"
                />
            </div>
            <p v-else class="text-center">&#8212;</p>
        </Td>
        <Td class="text-center company-table-item__notify">
            <span>&#8212;</span><span v-if="false">Пора позвонить клиенту</span>
        </Td>
        <Td class="company-table-item__date" sort="created_at">
            <DashboardChip
                v-if="isPassive"
                ref="passiveWhyCommentEl"
                class="dashboard-bg-danger offer-table-item__chip text-white"
            >
                Пассив
            </DashboardChip>
            <DashboardChip v-else class="dashboard-bg-success-l offer-table-item__chip">
                Актив
            </DashboardChip>
            <CompanyTableItemCall
                @to-chat="openInChat"
                @to-survey="openInSurvey"
                :call="company.last_call"
                :created-at="company.created_at"
                :without-contacts="isWithoutActiveContacts"
                class="my-1"
            />
            <TableDateBlock
                class="mt-1"
                :date="company.updated_at || company.created_at"
                label="Дата обновления"
            />
        </Td>
    </Tr>
    <CompanyTableDropdown
        v-if="isThereDropdown"
        @open-timeline="openTimeline"
        :odd="odd"
        :active-requests="activeRequests"
        :archive-requests="archiveRequests"
        :objects="company.objects"
    />
</template>

<script setup>
import CompanyTableDropdown from '@/components/Company/Table/CompanyTableDropdown.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import { useStore } from 'vuex';
import { computed, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { ActivityProfileList, CompanyCategories, PassiveWhy } from '@/const/const.js';
import Rating from '@/components/common/Rating.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import Avatar from '@/components/common/Avatar.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { getLinkCompany } from '@/utils/url.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { ucFirst } from '@/utils/formatters/string.js';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { messenger } from '@/const/messenger.js';
import CompanyTableItemCall from '@/components/Company/Table/CompanyTableItemCall.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { useTippyText } from '@/composables/useTippyText.js';

const store = useStore();
const router = useRouter();
const { openChat, openSurvey } = useMessenger();

const props = defineProps({
    company: { type: Object, required: true },
    odd: { type: Boolean, default: false }
});

const activeRequests = computed(() => props.company.requests.filter(({ status }) => status === 1));

const archiveRequests = computed(() => props.company.requests.filter(({ status }) => status === 2));

const isThereDropdown = computed(
    () =>
        activeRequests.value.length || archiveRequests.value.length || props.company.objects.length
);

const activityProfile = computed(() =>
    props.company.activity_profiles
        .map(el => ActivityProfileList[el.activity_profile_id].label)
        .join(', ')
);

const categories = computed(() =>
    props.company.categories.map(({ category }) => CompanyCategories[category])
);

const isPassive = computed(() => props.company.status === 0);

const isWithoutActiveContacts = computed(() => props.company.active_contacts_count === 0);

const passiveWhyComment = computed(() => {
    if (!props.company.passive_why) return 'Причина не указана';
    let text = PassiveWhy[props.company.passive_why].label;
    if (props.company.passive_why_comment) text += ': ' + props.company.passive_why_comment;
    return text;
});

const companyUrl = computed(() => getLinkCompany(props.company.id));
const companyName = computed(() => getCompanyName(props.company));

const openTimeline = requestID => {
    const route = router.resolve({
        path: `/companies/${props.company.id}`,
        query: {
            request_id: requestID,
            consultant_id: store.getters.THIS_USER.id,
            step: 0
        }
    });

    window.open(route.href);
};

const openInChat = () => {
    openChat(props.company.id, props.company.id, messenger.dialogTypes.COMPANY);
};

const openInSurvey = () => {
    openSurvey(messenger.dialogTypes.COMPANY, props.company.id, props.company.id);
};

useTippyText(useTemplateRef('passiveWhyCommentEl'), passiveWhyComment);
</script>
