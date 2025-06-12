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
                            @handle="$emit('create-task')"
                            icon="fa-solid fa-bolt"
                            label="Создать задачу"
                        />
                        <!--                        <UiDropdownActionsButton-->
                        <!--                            @handle="$emit('create-pinned-message')"-->
                        <!--                            icon="fa-solid fa-thumbtack"-->
                        <!--                            label="Добавить сообщение"-->
                        <!--                        />-->
                        <UiDropdownActionsButton
                            @handle="openInSurvey"
                            icon="fa-solid fa-square-poll-horizontal"
                            label="Открыть опрос"
                        />
                        <UiDropdownActionsButton
                            @handle="openInChat"
                            icon="fa-solid fa-comment"
                            label="Открыть в чате"
                        />
                        <template v-if="canDisable">
                            <UiDropdownActionsButton
                                v-if="isPassive"
                                @handle="$emit('enable')"
                                icon="fa-solid fa-undo"
                                label="Восстановить из архива"
                            />
                            <UiDropdownActionsButton
                                v-else
                                @handle="$emit('disable')"
                                icon="fa-solid fa-ban"
                                label="Отправить в архив"
                            />
                        </template>
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
            <CompanyTableItemSurvey v-if="company.last_survey" :company />
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
            <CompanyTableItemCall
                @to-chat="openInChat"
                @to-survey="openInSurvey"
                :call="company.last_call"
                :created-at="company.created_at"
                :without-contacts="isWithoutActiveContacts"
                class="my-1"
            />
            <DashboardChip
                v-if="isPassive"
                ref="passiveWhyCommentEl"
                class="dashboard-bg-danger-l offer-table-item__chip"
            >
                {{ passiveWhyLabel }}
            </DashboardChip>
            <TableDateBlock
                class="mt-1"
                :date="company.updated_at || company.created_at"
                label="Дата обновления"
            />
        </Td>
    </Tr>
    <CompanyTableDropdown
        v-if="dropdownMustBeShown"
        @open-timeline="openTimeline"
        @show-tasks="$emit('show-tasks')"
        @show-created-tasks="$emit('show-created-tasks')"
        :odd="odd"
        :active-requests="requestsByGroups.active"
        :archive-requests="requestsByGroups.passive"
        :done-requests="requestsByGroups.done"
        :objects="company.objects"
        :tasks-count="company.tasks_count"
        :created-tasks-count="company.created_task_ids?.length ?? 0"
        :company
    />
</template>

<script setup>
import CompanyTableDropdown from '@/components/Company/Table/CompanyTableDropdown.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import { useStore } from 'vuex';
import { computed, toRef, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { ActivityProfileList, PassiveWhy } from '@/const/const.js';
import Rating from '@/components/common/Rating.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
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
import UserFoldersDropdown from '@/components/UserFolder/UserFoldersDropdown.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useSurveyForm } from '@/composables/useSurveyForm.js';
import { useTippy } from 'vue-tippy';
import CompanyTableItemSurvey from '@/components/Company/Table/CompanyTableItemSurvey.vue';
import { useCompanyPermissions } from '@/components/Company/useCompanyPermissions.js';

const store = useStore();
const router = useRouter();

defineEmits([
    'deleted-from-folder',
    'create-pinned-message',
    'show-message',
    'unpin-message',
    'create-task',
    'show-tasks',
    'show-created-tasks',
    'disable',
    'enable'
]);

const props = defineProps({
    company: { type: Object, required: true },
    odd: { type: Boolean, default: false }
});

const requestsGroups = {
    0: 'passive',
    1: 'active',
    2: 'done',
    5: 'passive'
};

const requestsByGroups = computed(() =>
    Object.groupBy(props.company.requests, ({ status }) => requestsGroups[status])
);

const dropdownMustBeShown = computed(
    () =>
        props.company.objects.length ||
        props.company.requests.length ||
        props.company.tasks_count > 0
);

const activityProfile = computed(() =>
    props.company.activity_profiles
        .map(el => ActivityProfileList[el.activity_profile_id].label)
        .join(', ')
);

const isPassive = computed(() => props.company.status === 0);
const passiveWhyLabel = computed(() => PassiveWhy[props.company.passive_why].short ?? 'Пассив');

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

const { openChat } = useMessenger();

const openInChat = () => {
    openChat(props.company.id, props.company.id, messenger.dialogTypes.COMPANY);
};

const { openSurvey } = useSurveyForm();

const openInSurvey = () => {
    openSurvey(props.company.id);
};

useTippy(useTemplateRef('passiveWhyCommentEl'), { content: passiveWhyComment });

// permissions

const { canDisable } = useCompanyPermissions(toRef(props, 'company'));
</script>
