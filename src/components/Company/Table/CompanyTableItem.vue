<template>
    <Tr
        class="company-table-item position-relative"
        :class="{
            CompanyTableOdd: odd,
            CompanyTableEven: !odd,
            'fade-out': company.isDeleting
        }"
    >
        <Td name="id" class="text-center company-table-item__id">
            <Loader v-if="company.isLoading" class="absolute-center" small />
            <p class="mb-2">{{ company.id }}</p>
            <Avatar
                v-if="company.consultant"
                :label="company.consultant.userProfile.medium_name"
                :src="company.consultant.userProfile.avatar"
                :size="30"
                class="mx-auto"
            />
        </Td>
        <Td name="name" class="company-table-item__name position-relative">
            <div class="company-table-item__main">
                <CompanyLogo
                    :company-id="company.id"
                    :company-name="companyName"
                    :src="company.logo"
                    :class="{ 'op-5': isDeleted }"
                />
                <CompanyTableItemInfo :company />
            </div>
            <CompanyTableDropdown
                v-if="dropdownMustBeShown"
                v-model:objects-visible="objectsIsOpen"
                v-model:requests-visible="requestsIsOpen"
                :company
                class="mt-2"
            />
            <TableDateBlock :date="company.created_at" class="mt-1 op-7">
                <template #label="{ formattedDate }">
                    <p class="mb-1">
                        Дата внесения в базу -
                        <span class="font-weight-semi">{{ formattedDate }}</span>
                    </p>
                    <p v-if="company.updated_at">
                        Дата последнего обновления -
                        <span class="font-weight-semi">{{ updatedAt }}</span>
                    </p>
                    <p v-else class="op-5 text-grey">Дата последнего обновления утеряна</p>
                </template>
            </TableDateBlock>
        </Td>
        <Td name="status" class="company-table-item__comment">
            <CompanyTableItemSummary
                @create-task="$emit('create-task')"
                @schedule-call="$emit('schedule-call')"
                @schedule-visit="$emit('schedule-visit')"
                @schedule-event="$emit('schedule-event')"
                @disable="$emit('disable')"
                @enable="$emit('enable')"
                @open-chat="openInChat"
                @open-survey="openInSurvey"
                @show-survey="$emit('show-survey')"
                @deleted-from-folder="$emit('deleted-from-folder', $event)"
                @open-preview="$emit('show-survey')"
                @edit-comment="$emit('edit-survey-comment')"
                @show-task="$emit('show-task', $event)"
                @show-comments="$emit('show-company-comments')"
                @show-notes="$emit('show-company-notes')"
                :company
            />
        </Td>
    </Tr>
    <CompanyTableItemObjects
        v-if="company.objects?.length"
        v-model:visible="objectsIsOpen"
        :company
    />
    <CompanyTableItemRequests
        v-if="requestsIsOpen"
        @open-timeline="openTimeline"
        @create-task="$emit('create-request-task', $event)"
        :company-id="company.id"
    />
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import { useStore } from 'vuex';
import { computed, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { PassiveWhy } from '@/const/const.js';
import Avatar from '@/components/common/Avatar.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { messenger } from '@/const/messenger.js';
import { useSurveyForm } from '@/composables/useSurveyForm.js';
import { useTippy } from 'vue-tippy';
import CompanyTableItemObjects from '@/components/Company/Table/CompanyTableItemObjects.vue';
import CompanyTableItemRequests from '@/components/Company/Table/CompanyTableItemRequests.vue';
import CompanyTableDropdown from '@/components/Company/Table/CompanyTableDropdown.vue';
import CompanyTableItemInfo from '@/components/Company/Table/CompanyTableItemInfo.vue';
import CompanyTableItemSummary from '@/components/Company/Table/Summary/CompanyTableItemSummary.vue';
import Loader from '@/components/common/Loader.vue';
import { CompanyStatusEnum } from '@/types/company';
import { toBeautifulDateFormat } from '@/utils/formatters/date';

const store = useStore();
const router = useRouter();

defineEmits([
    'deleted-from-folder',
    'create-task',
    'create-request-task',
    'show-tasks',
    'show-created-tasks',
    'disable',
    'enable',
    'show-survey',
    'show-task',
    'edit-survey-comment',
    'schedule-call',
    'schedule-visit',
    'schedule-event',
    'show-company-notes',
    'show-company-comments'
]);

const props = defineProps({
    company: { type: Object, required: true },
    odd: { type: Boolean, default: false }
});

const updatedAt = computed(() => toBeautifulDateFormat(props.company.updated_at));

const dropdownMustBeShown = computed(
    () => props.company.objects.length || props.company.requests.length
);

// TODO: Как-то внедрить тут пассив
const isDeleted = computed(() => props.company.status === CompanyStatusEnum.DELETED);

const passiveWhyComment = computed(() => {
    if (!props.company.passive_why) return 'Причина не указана';
    let text = PassiveWhy[props.company.passive_why].label;
    if (props.company.passive_why_comment) text += ': ' + props.company.passive_why_comment;
    return text;
});

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

// dropdown

const objectsIsOpen = ref(false);
const requestsIsOpen = ref(false);
</script>
