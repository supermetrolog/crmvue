<template>
    <Tr class="company-table-item" :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }">
        <Td class="text-center company-table-item__id">
            {{ company.id }}
        </Td>
        <Td class="company-table-item__name" sort="nameRu">
            <a class="company-table-item__title" :href="$url.company(company.id)" target="_blank">
                <h4 :class="{ 'text-warning': !company.status }">
                    {{ company.full_name }}
                </h4>
            </a>
            <span v-if="company.activityProfile !== null" class="company-table-item__profile">
                {{ activityProfile }}
            </span>
            <Rating :rating="rating" :max="3" color="yellow" />
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
                class="bg-white"
                :contact="company.mainContact"
            />
            <p v-else class="text-center">&#8212;</p>
        </Td>
        <Td class="text-center company-table-item__survey"><span></span></Td>
        <Td class="company-table-item__consultant">
            <div v-if="company.consultant" class="company-table-item__consultant-wrapper">
                <Avatar :src="company.consultant.userProfile.avatar" size="35" />
                <span>{{ company.consultant.userProfile.medium_name }}</span>
            </div>
            <p v-else class="text-center">&#8212;</p>
        </Td>
        <Td class="company-table-item__notify text-warning">
            <span v-if="false">Пора позвонить клиенту</span>
        </Td>
        <Td class="company-table-item__date" sort="created_at">
            <div class="d-flex">
                <TableDateBlock class="mx-auto" :date="company.updated_at" label="Обновление" />
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
import { ActivityProfileList, CompanyCategories } from '@/const/const.js';
import Rating from '@/components/common/Rating.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import Avatar from '@/components/common/Avatar.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';

const store = useStore();
const router = useRouter();

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
const rating = computed(() => (props.company.rating + 3) / 3);

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
</script>
