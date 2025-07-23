<template>
    <div class="d-flex gap-2 align-items-center justify-content-end">
        <UiButtonIcon
            @click="$emit('open-survey')"
            small
            :icon="company.has_pending_survey ? 'fa-solid fa-play' : 'fa-solid fa-phone'"
            :label="company.has_pending_survey ? 'Продолжить опрос' : 'Начать опрос'"
            :color="surveyButtonColor"
        />
        <UiDropdownActions label="Действия над компанией" :title="companyShortName" small>
            <template #menu>
                <UiDropdownActionsGroup>
                    <UiDropdownActionsButton
                        @handle="$emit('create-task')"
                        icon="fa-solid fa-bolt"
                        label="Создать задачу"
                    />
                    <UiDropdownActionsNested icon="fa-solid fa-calendar-plus" label="Запланировать">
                        <template #menu>
                            <UiDropdownActionsButton
                                @handle="$emit('schedule-call')"
                                icon="fa-solid fa-phone"
                                label="Звонок"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('schedule-visit')"
                                icon="fa-solid fa-people-arrows"
                                label="Встреча"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('schedule-event')"
                                icon="fa-solid fa-calendar-plus"
                                label="Действие"
                            />
                        </template>
                    </UiDropdownActionsNested>
                </UiDropdownActionsGroup>
                <UiDropdownActionsGroup>
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
                </UiDropdownActionsGroup>
            </template>
        </UiDropdownActions>
        <UiButtonIcon
            @click="$emit('open-chat')"
            label="Открыть чат"
            icon="fa-solid fa-comment"
            small
        />
        <UserFoldersDropdown
            @deleted-from-folder="$emit('deleted-from-folder', $event)"
            morph="company"
            :entity="company.id"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import UserFoldersDropdown from '@/components/UserFolder/UserFoldersDropdown.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useCompanyPermissions } from '@/components/Company/useCompanyPermissions.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import UiDropdownActionsNested from '@/components/common/UI/DropdownActions/UiDropdownActionsNested.vue';
import dayjs from 'dayjs';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { SurveyStatusEnum } from '@/types/survey';
import { dayjsFromMoscow } from '@/utils/formatters/date';

defineEmits<{
    (e: 'deleted-from-folder', folderId: number): void;
    (e: 'create-task'): void;
    (e: 'schedule-call'): void;
    (e: 'schedule-visit'): void;
    (e: 'schedule-event'): void;
    (e: 'open-survey'): void;
    (e: 'open-chat'): void;
    (e: 'enable'): void;
    (e: 'disable'): void;
}>();

const props = defineProps<{
    company: object;
}>();

const isPassive = computed(() => props.company.status === 0);

const companyShortName = computed(() => getCompanyShortName(props.company));

// permissions

// TODO: Permissions

const { canDisable } = useCompanyPermissions(toRef(props, 'company'));

const isRecentlyCreated = computed(() => dayjs().diff(dayjs(props.company.created_at), 'day') < 14);

const lastSurveyHasCompleteStatus = computed(() => {
    if (isNullish(props.company.last_survey)) return false;
    return props.company.last_survey.status === SurveyStatusEnum.COMPLETED;
});

const lastSurveyIsOutdated = computed(() => {
    if (isNullish(props.company.last_survey)) return false;

    return (
        dayjs().diff(
            dayjsFromMoscow(
                props.company.last_survey.completed_at ?? props.company.last_survey.updated_at
            ),
            'day'
        ) > import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER
    );
});

const surveyButtonColor = computed(() => {
    if (props.company.has_pending_survey) {
        return 'warning';
    }

    if (props.company.last_survey) {
        if (lastSurveyHasCompleteStatus.value && lastSurveyIsOutdated.value) {
            return 'danger';
        }

        return 'success-light';
    }

    if (isRecentlyCreated.value) {
        return 'success-light';
    }

    return 'danger';
});
</script>
