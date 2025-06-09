<template>
    <Tr class="survey-table-item">
        <Td :width="60" class="survey-table-item__id py-2">
            <p class="text-center">{{ survey.id }}</p>
            <div class="justify-content-center d-flex mt-1">
                <UiDropdownActions small label="Действия над опросом">
                    <template #menu>
                        <UiDropdownActionsButton
                            @handle="$emit('open-survey')"
                            label="Открыть опрос"
                            icon="fa-solid fa-eye"
                        />
                        <UiDropdownActionsButton
                            @handle="$emit('to-chat')"
                            label="Перейти в чат"
                            icon="fa-solid fa-comment"
                        />
                        <a :href="companyUrl" target="_blank" class="text-inherit">
                            <UiDropdownActionsButton
                                label="Перейти к компании"
                                icon="fa-solid fa-arrow-up-right-from-square"
                            />
                        </a>
                    </template>
                </UiDropdownActions>
            </div>
        </Td>
        <Td sort="chat_member_id" :width="350" class="py-2">
            <UiDropdownActions small label="Действия над опросом" class="w-100 d-block">
                <template #trigger>
                    <MessengerDialogObject
                        v-if="survey.chatMember.model_type === messenger.dialogTypes.OBJECT"
                        :model="survey.chatMember.model"
                        short
                        motion-slider
                        show-company
                        class="w-100"
                    />
                    <MessengerDialogCompany v-else :model="survey.chatMember.model" short />
                </template>
                <template #menu>
                    <UiDropdownActionsButton
                        @handle="$emit('open-survey')"
                        label="Открыть опрос"
                        icon="fa-solid fa-eye"
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('to-chat')"
                        label="Перейти в чат"
                        icon="fa-solid fa-comment"
                    />
                </template>
            </UiDropdownActions>
        </Td>
        <Td sort="contact_id" :width="200" class="py-2">
            <template v-if="survey.contact_id">
                <p class="font-weight-semi">
                    <UiTooltipIcon
                        v-if="survey.contact.isMain"
                        tooltip="Основной контакт"
                        icon="fa-solid fa-crown"
                        class="mr-1"
                    />
                    <UiTooltipIcon
                        v-if="survey.contact.faceToFaceMeeting"
                        tooltip="Была личная (очная) встреча"
                        icon="fa-solid fa-street-view"
                        class="mr-1"
                    />
                    <UiTooltipIcon
                        v-if="survey.contact.good"
                        tooltip="Хорошие взаимоотношения"
                        icon="fa-regular fa-face-smile-beam"
                        class="mr-1"
                    />
                    <span>{{ survey.contact.full_name }}</span>
                    <UiTooltipIcon
                        v-if="survey.contact.warning"
                        :tooltip="survey.contact.warning_why_comment"
                        icon="fa-solid fa-exclamation-circle"
                        class="ml-1 icon text-danger"
                    />
                </p>
                <p v-if="survey.contact.position_unknown" class="text-grey fs-2">
                    Должность неизвестна
                </p>
                <p v-else class="text-grey fs-2">{{ position }}</p>
                <div v-if="survey.contact?.phones?.length" class="call-table-item__phones">
                    <PhoneNumber
                        v-for="phone of survey.contact.phones"
                        :key="phone.id"
                        :phone="phone"
                        :contact="survey.contact"
                        hidden
                        clickable
                        class="call-table-item__phone"
                    />
                </div>
            </template>
            <p v-else class="messenger-warning">&#8212;</p>
        </Td>
        <Td :width="100">
            <p v-if="survey.calls.length">{{ callsLabel }}</p>
            <p v-else class="text-grey">без звонка</p>
        </Td>
        <Td sort="user_id" :width="180">
            <div class="d-flex align-items-center gap-2">
                <Avatar :src="survey.user.userProfile.avatar" :size="30" />
                <span>{{ survey.user.userProfile.medium_name }}</span>
            </div>
        </Td>
        <Td :width="80" class="text-center">
            <p :class="statusColor" class="font-weight-semi">{{ statusLabel }}</p>
        </Td>
        <Td sort="created_at" :width="100">
            <TableDateBlock :date="survey.created_at" label="Дата создания" />
            <TableDateBlock
                v-if="isCompleted"
                :date="survey.completed_at ?? survey.updated_at"
                icon="fa-solid fa-check"
                label="Дата завершения"
                class="mt-1"
            />
        </Td>
    </Tr>
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import Avatar from '@/components/common/Avatar.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { computed } from 'vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { messenger } from '@/const/messenger.js';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import { useRouter } from 'vue-router';
import { plural } from '@/utils/plural.js';

defineEmits(['to-chat', 'open-survey']);
const props = defineProps({
    survey: {
        type: Object,
        required: true
    }
});

const surveyStatusesEnum = {
    COMPLETED: 'completed',
    DRAFT: 'draft',
    CANCELLED: 'canceled'
};

const surveyStatuses = {
    [surveyStatusesEnum.COMPLETED]: 'Завершен',
    [surveyStatusesEnum.DRAFT]: 'Черновик',
    [surveyStatusesEnum.CANCELLED]: 'Отменен'
};

const statusLabel = computed(() => surveyStatuses[props.survey.status]);

const statusColor = computed(() => {
    if (props.survey.status === surveyStatusesEnum.COMPLETED) return 'text-success';
    if (props.survey.status === surveyStatusesEnum.DRAFT) return 'text-grey';
    return 'color-danger';
});

const position = computed(() => {
    return contactOptions.position[props.survey.contact.position];
});

const isCompleted = computed(() => props.survey.status === surveyStatusesEnum.COMPLETED);

const router = useRouter();

const companyUrl = computed(() => {
    if (props.survey.chatMember.model_type === messenger.dialogTypes.COMPANY) {
        return router.resolve({ name: 'company', params: { id: props.survey.chatMember.model_id } })
            .href;
    }

    return router.resolve({
        name: 'company',
        params: {
            id:
                props.survey.chatMember.model.object.company?.id ??
                props.survey.chatMember.model.object.company_id
        }
    }).href;
});

const callsLabel = computed(() =>
    plural(props.survey.calls.length, '%d звонок', '%d звонка', '%d звонков')
);
</script>
