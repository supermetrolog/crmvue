<template>
    <div class="d-flex gap-2 align-items-center justify-content-end">
        <UserFoldersDropdown
            @deleted-from-folder="$emit('deleted-from-folder', $event)"
            morph="company"
            :entity="company.id"
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
                    <UiDropdownActionsButton
                        @handle="$emit('create-pinned-message')"
                        icon="fa-solid fa-thumbtack"
                        label="Добавить сообщение"
                    />
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
            @click="$emit('open-survey')"
            small
            :icon="
                company.has_pending_survey
                    ? 'fa-solid fa-play'
                    : 'fa-solid fa-square-poll-horizontal'
            "
            :label="company.has_pending_survey ? 'Продолжить опрос' : 'Начать опрос'"
            :color="surveyButtonColor"
        />
        <UiButtonIcon
            @click="$emit('open-chat')"
            label="Открыть чат"
            icon="fa-solid fa-comment"
            small
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

defineEmits<{
    (e: 'deleted-from-folder', folderId: number): void;
    (e: 'create-task'): void;
    (e: 'schedule-call'): void;
    (e: 'schedule-visit'): void;
    (e: 'schedule-event'): void;
    (e: 'create-pinned-message'): void;
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

const surveyButtonColor = computed(() => {
    if (props.company.has_pending_survey) {
        return props.company.pending_survey_status === 'draft' ? 'success-light' : 'warning-light';
    }

    return undefined;
});
</script>
