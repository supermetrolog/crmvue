<template>
    <Tr class="company-table-item" :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }">
        <Td class="text-center company-table-item__id">
            <p class="mb-1">{{ company.id }}</p>
            <div class="company-table-item__buttons">
                <HoverActionsButton @click="openInChat" label="Открыть в чате">
                    <i class="fa-solid fa-comment" />
                </HoverActionsButton>
            </div>
        </Td>
        <Td class="company-table-item__name" sort="nameRu">
            <div class="company-table-item__main">
                <CompanyLogo
                    :company-id="company.id"
                    :company-name="company.full_name"
                    :src="company.logo"
                />
                <div>
                    <a class="company-table-item__title" :href="companyUrl" target="_blank">
                        <h4 :class="{ 'text-warning': isPassive }">
                            {{ company.full_name }}
                        </h4>
                    </a>
                    <p v-if="company.companyGroup" class="company-table-item__company-group">
                        {{ company.companyGroup.full_name }}
                    </p>
                    <span
                        v-if="company.activityProfile !== null"
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
                v-tippy="passiveWhyComment"
                class="dashboard-bg-danger offer-table-item__chip text-white"
            >
                Пассив
            </DashboardChip>
            <DashboardChip v-else class="dashboard-bg-success-l offer-table-item__chip">
                Актив
            </DashboardChip>
            <!--            <OfferTableItemCall @click="openSurvey" :call="company.last_call" />-->
            <!--            <HoverActionsButton-->
            <!--                @click="openInChat"-->
            <!--                class="my-2 mx-auto offer-table-item__chat"-->
            <!--                :label="`У вас ${offer.unread_message_count} непрочитанных сообщений по этой компании`"-->
            <!--            >-->
            <!--                <div class="d-flex flex-column">-->
            <!--                    <i class="fa-solid fa-comment" />-->
            <!--                    <span>{{ offer.unread_message_count }}</span>-->
            <!--                </div>-->
            <!--            </HoverActionsButton>-->
            <TableDateBlock
                class="text-center"
                :date="company.updated_at || company.created_at"
                label="Обновление"
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
import { getLinkCompany } from '@/utils/url.js';
import { ucFirst } from '@/utils/formatter.js';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { messenger } from '@/const/messenger.js';

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

const companyUrl = computed(() => getLinkCompany(props.company.id));

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
    openSurvey(
        messenger.dialogTypes.COMPANY,
        messenger.surveyType.COMPANY,
        props.company.id,
        props.company.id
    );
};
</script>
