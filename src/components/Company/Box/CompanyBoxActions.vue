<template>
    <UiDropdownActions
        label="Действия над компанией"
        :title="companyShortName"
        small
        class="ml-auto"
    >
        <template #trigger>
            <UiButton small color="light" icon="fa-solid fa-gear">Действия</UiButton>
        </template>
        <template #menu>
            <UiDropdownActionsGroup>
                <UiDropdownActionsButton
                    @handle="$emit('create-task')"
                    icon="fa-solid fa-bolt"
                    label="Создать задачу"
                />
                <UiDropdownActionsButton
                    @handle="$emit('schedule-call')"
                    icon="fa-solid fa-phone"
                    label="Запланировать звонок"
                />
                <UiDropdownActionsButton
                    @handle="$emit('schedule-visit')"
                    icon="fa-solid fa-people-arrows"
                    label="Запланировать встречу"
                />
            </UiDropdownActionsGroup>
            <UiDropdownActionsGroup>
                <!--                            <UiDropdownActionsButton-->
                <!--                                @handle="$emit('create-pinned-message')"-->
                <!--                                icon="fa-solid fa-thumbtack"-->
                <!--                                label="Добавить сообщение"-->
                <!--                            />-->
                <UiDropdownActionsButton
                    @handle="openInSurvey"
                    :icon="
                        company.has_pending_survey
                            ? 'fa-solid fa-play'
                            : 'fa-solid fa-square-poll-horizontal'
                    "
                    :label="company.has_pending_survey ? 'Продолжить опрос' : 'Начать опрос'"
                />
                <UiDropdownActionsButton
                    @handle="$emit('open-in-chat')"
                    icon="fa-solid fa-comment"
                    label="Открыть в чате"
                />
            </UiDropdownActionsGroup>
            <UiDropdownActionsGroup>
                <template v-if="currentUserIsModeratorOrHigher">
                    <UiDropdownActionsButton
                        v-if="!isPassive"
                        @handle="$emit('change-consultant')"
                        label="Изменить консультанта"
                        icon="fa-solid fa-user-tag"
                    />
                    <UiDropdownActionsButton
                        v-if="isPassive || isDeleted"
                        @handle="$emit('enable')"
                        icon="fa-solid fa-undo"
                        :label="isPassive ? 'Восстановить из архива' : 'Восстановить из корзины'"
                    />
                    <UiDropdownActionsButton
                        v-else
                        @handle="$emit('delete')"
                        icon="fa-solid fa-trash"
                        label="Отправить в корзину"
                    />
                </template>
                <template v-else>
                    <UiDropdownActionsButton
                        @handle="$emit('request-change-consultant')"
                        label="Запросить смену консультанта"
                        icon="fa-solid fa-user-tag"
                    />
                    <UiDropdownActionsButton
                        v-if="isPassive"
                        @handle="$emit('request-enable')"
                        icon="fa-solid fa-undo"
                        label="Запросить восстановление"
                    />
                    <UiDropdownActionsButton
                        v-else-if="isActive"
                        @handle="$emit('request-delete')"
                        icon="fa-solid fa-trash"
                        label="Запросить удаление"
                    />
                </template>
                <UiDropdownActionsButton
                    @handle="$emit('change-logo')"
                    label="Изменить логотип"
                    icon="fa-solid fa-image"
                />
            </UiDropdownActionsGroup>
        </template>
    </UiDropdownActions>
</template>

<script setup>
import { computed } from 'vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import { useSurveyForm } from '@/composables/useSurveyForm.ts';
import { CompanyStatusEnum } from '@/types/company';
import { useAuth } from '@/composables/useAuth';

defineEmits([
    'change-logo',
    'delete',
    'enable',
    'change-consultant',
    'open-in-chat',
    'open-in-survey',
    'schedule-visit',
    'schedule-call',
    'create-task',
    'request-delete',
    'request-enable',
    'request-change-consultant'
]);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const companyShortName = computed(() => getCompanyShortName(props.company));

const { currentUserIsModeratorOrHigher } = useAuth();

// status

const isPassive = computed(() => props.company.status === CompanyStatusEnum.PASSIVE);
const isDeleted = computed(() => props.company.status === CompanyStatusEnum.DELETED);
const isActive = computed(() => props.company.status === CompanyStatusEnum.ACTIVE);

// survey

const { openSurvey } = useSurveyForm();

const openInSurvey = () => {
    openSurvey(props.company.id);
};
</script>
