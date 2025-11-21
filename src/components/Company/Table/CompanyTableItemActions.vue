<template>
    <div class="d-flex gap-2 align-items-center justify-content-end">
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
                            v-if="isPassive || isDeleted"
                            @handle="$emit('enable')"
                            icon="fa-solid fa-undo"
                            :label="
                                isPassive ? 'Восстановить из архива' : 'Восстановить из корзины'
                            "
                        />
                        <UiDropdownActionsButton
                            v-else
                            @handle="$emit('disable')"
                            icon="fa-solid fa-ban"
                            label="Отправить в корзину"
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
            @create="$emit('create-folder')"
            :entity="company.id"
            creatable
            morph="company"
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
import { CompanyStatusEnum } from '@/types/company';

defineEmits<{
    (e: 'deleted-from-folder', folderId: number): void;
    (e: 'create-folder'): void;
    (e: 'create-task'): void;
    (e: 'schedule-call'): void;
    (e: 'schedule-visit'): void;
    (e: 'schedule-event'): void;
    (e: 'open-chat'): void;
    (e: 'enable'): void;
    (e: 'disable'): void;
}>();

const props = defineProps<{
    company: object;
}>();

const isPassive = computed(() => props.company.status === CompanyStatusEnum.ACTIVE);
const isDeleted = computed(() => props.company.status === CompanyStatusEnum.DELETED);

const companyShortName = computed(() => getCompanyShortName(props.company));

// permissions

// TODO: Permissions

const { canDisable } = useCompanyPermissions(toRef(props, 'company'));
</script>
