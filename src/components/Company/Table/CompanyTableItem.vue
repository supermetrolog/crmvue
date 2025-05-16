<template>
    <Tr
        class="company-table-item"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd, 'fade-out': company.isDeleting }"
    >
        <Td class="text-center company-table-item__id">
            <p class="mb-1">{{ company.id }}</p>
            <div class="d-flex flex-column gap-2 align-items-center">
                <UserFoldersDropdown
                    @deleted-from-folder="$emit('deleted-from-folder', $event)"
                    morph="company"
                    :entity="company.id"
                />
                <UiDropdownActions label="Действия над компанией" small>
                    <template #menu>
                        <UiDropdownActionsButton
                            @handle="$emit('create-pinned-message')"
                            icon="fa-solid fa-thumbtack"
                            label="Добавить сообщение"
                        />
                        <UiDropdownActionsButton
                            disabled
                            icon="fa-solid fa-bolt"
                            label="Создать задачу"
                        />
                        <UiDropdownActionsButton
                            @handle="openInChat"
                            icon="fa-solid fa-comment"
                            label="Открыть в чате"
                        />
                        <UiDropdownActionsButton
                            @handle="openInSurvey"
                            icon="fa-solid fa-square-poll-horizontal"
                            label="Открыть опрос"
                        />
                    </template>
                </UiDropdownActions>
            </div>
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
        <Td class="company-table-item__comment">
            <template v-if="company.chat_member_pinned_message">
                <div class="d-flex gap-1"></div>
                <MessengerDialogLastMessage
                    @click="$emit('show-message', company.chat_member_pinned_message)"
                    :last-message="company.chat_member_pinned_message"
                    class="company-table-item__message w-100"
                    hide-avatar
                    column
                >
                    <template #after>
                        <UiDropdownActions small label="Действия над сообщением" class="ml-auto">
                            <template #menu>
                                <UiDropdownActionsButton
                                    @handle="$emit('create-pinned-message')"
                                    label="Добавить новое сообщение"
                                    icon="fa-solid fa-plus"
                                />
                                <UiDropdownActionsButton
                                    @handle="
                                        $emit('unpin-message', company.chat_member_pinned_message)
                                    "
                                    label="Открепить сообщение"
                                    icon="fa-solid fa-trash"
                                />
                            </template>
                        </UiDropdownActions>
                    </template>
                </MessengerDialogLastMessage>
            </template>
            <template v-else>
                <p class="text-center">&#8212;</p>
                <UiButton
                    @click="$emit('create-pinned-message')"
                    class="company-table-item__comment-button"
                    color="light"
                    small
                    icon="fa-solid fa-plus"
                >
                    Добавить сообщение
                </UiButton>
            </template>
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
        <Td class="company-table-item__date" sort="created_at">
            <DashboardChip
                v-if="isPassive"
                ref="passiveWhyCommentEl"
                class="dashboard-bg-danger-l offer-table-item__chip"
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
import UserFoldersDropdown from '@/components/UserFolder/UserFoldersDropdown.vue';
import MessengerDialogLastMessage from '@/components/Messenger/Dialog/MessengerDialogLastMessage.vue';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import HoverActions from '@/components/common/HoverActions/HoverActions.vue';

const store = useStore();
const router = useRouter();
const { openChat, openSurvey } = useMessenger();

defineEmits(['deleted-from-folder', 'create-pinned-message', 'show-message', 'unpin-message']);
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
