<template>
    <Tr
        class="company-table-item"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd, 'fade-out': company.isDeleting }"
    >
        <Td class="text-center company-table-item__id">
            <p class="mb-1">{{ company.id }}</p>
            <CompanyTableItemActions
                @create-task="$emit('create-task')"
                @schedule-call="$emit('schedule-call')"
                @schedule-visit="$emit('schedule-visit')"
                @schedule-event="$emit('schedule-event')"
                @disable="$emit('disable')"
                @enable="$emit('enable')"
                @create-pinned-message="$emit('create-pinned-message')"
                @open-chat="openInChat"
                @open-survey="openInSurvey"
                @deleted-from-folder="$emit('deleted-from-folder', $event)"
                :company
            />
        </Td>
        <Td class="company-table-item__name" sort="nameRu">
            <div class="company-table-item__main">
                <CompanyLogo
                    :company-id="company.id"
                    :company-name="companyName"
                    :src="company.logo"
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
        </Td>
        <Td class="company-table-item__comment">
            <CompanyTableItemSurvey
                v-if="company.last_survey"
                @open-preview="$emit('show-survey')"
                @create-task="$emit('create-survey-task')"
                @edit-comment="$emit('edit-survey-comment')"
                @show-task="$emit('show-task', $event)"
                :company
            />
            <CompanyTableItemPinnedMessages
                v-if="company.pinned_messages.length"
                @show-message="$emit('show-message', $event)"
                @unpin-message="$emit('unpin-message', $event)"
                @create-pinned-message="$emit('create-pinned-message')"
                :company
            />
            <div
                v-if="!company.last_survey"
                class="company-table-item__comment-buttons"
                :class="{ absolute: company.pinned_messages.length === 0 }"
            >
                <UiButton
                    v-if="company.pinned_messages.length === 0"
                    @click="$emit('create-pinned-message')"
                    class="company-table-item__comment-button"
                    color="light"
                    small
                    icon="fa-solid fa-plus"
                >
                    Добавить сообщение
                </UiButton>
                <UiButton
                    @click="openInSurvey"
                    class="company-table-item__comment-button"
                    color="light"
                    small
                    icon="fa-solid fa-play"
                >
                    Пройти опрос
                </UiButton>
            </div>
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
        <Td class="company-table-item__date position-relative" sort="created_at">
            <UiField
                v-if="isPassive"
                ref="passiveWhyCommentEl"
                class="offer-table-item__chip text-white danger font-weight-semi"
            >
                {{ passiveWhyLabel }}
            </UiField>
            <CompanyTableItemActivity
                @to-chat="openInChat"
                @to-survey="openInSurvey"
                @show-task="$emit('show-task', $event)"
                @show-tasks="$emit('show-tasks')"
                :company
                class="my-1"
            />
            <TableDateBlock
                :date="company.updated_at || company.created_at"
                label="Дата обновления"
                class="mt-1"
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
import CompanyTableItemSurvey from '@/components/Company/Table/CompanyTableItemSurvey.vue';
import CompanyTableItemObjects from '@/components/Company/Table/CompanyTableItemObjects.vue';
import CompanyTableItemRequests from '@/components/Company/Table/CompanyTableItemRequests.vue';
import CompanyTableDropdown from '@/components/Company/Table/CompanyTableDropdown.vue';
import CompanyTableItemInfo from '@/components/Company/Table/CompanyTableItemInfo.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import CompanyTableItemPinnedMessages from '@/components/Company/Table/CompanyTableItemPinnedMessages.vue';
import UiField from '@/components/common/UI/UiField.vue';
import CompanyTableItemActions from '@/components/Company/Table/CompanyTableItemActions.vue';
import CompanyTableItemActivity from '@/components/Company/Table/CompanyTableItemActivity.vue';

const store = useStore();
const router = useRouter();

defineEmits([
    'deleted-from-folder',
    'create-pinned-message',
    'show-message',
    'unpin-message',
    'create-task',
    'create-request-task',
    'create-survey-task',
    'show-tasks',
    'show-created-tasks',
    'disable',
    'enable',
    'show-survey',
    'show-task',
    'edit-survey-comment',
    'schedule-call',
    'schedule-visit',
    'schedule-event'
]);

const props = defineProps({
    company: { type: Object, required: true },
    odd: { type: Boolean, default: false }
});

const dropdownMustBeShown = computed(
    () => props.company.objects.length || props.company.requests.length
);

const isPassive = computed(() => props.company.status === 0);
const passiveWhyLabel = computed(() => PassiveWhy[props.company.passive_why].short ?? 'Пассив');

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
