<template>
    <Tr class="company-table-item" :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }">
        <Td class="text-center company-table-item__id">
            <p class="mb-1">{{ company.id }}</p>
            <DashboardChip
                v-if="isPassive"
                v-tippy="passiveWhyComment"
                class="dashboard-bg-danger text-white mb-2"
            >
                <div class="d-flex align-items-center gap-1">
                    <span>Пассив</span>
                    <i class="fa-regular fa-question-circle" />
                </div>
            </DashboardChip>
            <div class="company-table-item__buttons">
                <HoverActionsButton @click="openInChat" label="Открыть в чате">
                    <i class="fa-solid fa-comment" />
                </HoverActionsButton>
            </div>
        </Td>
        <Td class="company-table-item__name" sort="nameRu">
            <a class="company-table-item__title" :href="$url.company(company.id)" target="_blank">
                <h4 :class="{ 'text-warning': isPassive }">
                    {{ company.full_name }}
                </h4>
            </a>
            <p v-if="company.companyGroup" class="company-table-item__company-group">
                {{ company.companyGroup.full_name }}
            </p>
            <span v-if="company.activityProfile !== null" class="company-table-item__profile">
                {{ activityProfile }}
            </span>
            <div
                v-if="company.productRanges?.length"
                class="company-table-item__product-ranges my-1"
            >
                <DashboardChip
                    v-for="productRange in company.productRanges"
                    :key="productRange.id"
                    class="dashboard-bg-light"
                >
                    {{ $formatter.text().ucFirst(productRange.product) }}
                </DashboardChip>
            </div>
            <Rating v-if="company.rating" :rating="company.rating" color="yellow" />
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
            <CompanyContact v-if="company.mainContact" :contact="company.mainContact" />
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
            <div class="d-flex">
                <TableDateBlock
                    class="mx-auto"
                    :date="company.updated_at || company.created_at"
                    label="Обновление"
                />
            </div>
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ActivityProfileList, CompanyCategories, PassiveWhy } from '@/const/const.js';
import Rating from '@/components/common/Rating.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import Avatar from '@/components/common/Avatar.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';

const store = useStore();
const router = useRouter();
const { openChatByCompanyId } = useMessenger();

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
const activityProfile = computed(() => ActivityProfileList[props.company.activityProfile].label);
const categories = computed(() =>
    props.company.categories.map(({ category }) => CompanyCategories[category])
);
const isPassive = computed(() => props.company.status === 0);
const passiveWhyComment = computed(() => {
    if (!props.company.passive_why) return 'Причина не указана';
    let text = PassiveWhy[props.company.passive_why].label;
    if (props.company.passive_why_comment) text += ': ' + props.company.passive_why_comment;
    return text;
});

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
    openChatByCompanyId(props.company.id);
};
</script>
