<template>
    <div class="object-map-popup__footer">
        <RouterLink
            :to="{ name: 'complex.view', params: { complex_id: object.complex_id } }"
            target="_blank"
        >
            <UiButton
                tooltip="Вы перейдете в комплекс с подробным описанием строения"
                color="light"
                icon="fa-solid fa-external-link"
            >
                Подробнее
            </UiButton>
        </RouterLink>
        <UiDropdownActions title="Действия над объектом">
            <template #trigger>
                <UiButton color="light" icon="fa-solid fa-gear">Действия</UiButton>
            </template>
            <template #menu>
                <UiDropdownActionsButton
                    @handle="openInSurvey"
                    icon="fa-solid fa-square-poll-horizontal"
                    label="Открыть опрос"
                    :disabled="!object.company_id"
                />
                <UiDropdownActionsButton
                    @handle="openInChat"
                    icon="fa-solid fa-comment"
                    label="Открыть в чате"
                    :disabled="!object.company_id"
                />
                <RouterLink
                    :to="{ name: 'complex.view', params: { complex_id: object.complex_id } }"
                    target="_blank"
                    class="ui-dropdown-actions__element text-inherit"
                >
                    <UiDropdownActionsButton
                        icon="fa-solid fa-external-link"
                        label="Перейти в комплекс"
                        :disabled="!object.complex_id"
                    />
                </RouterLink>
                <RouterLink
                    v-if="object.company_id"
                    :to="{ name: 'company', params: { id: object.company_id } }"
                    target="_blank"
                    class="ui-dropdown-actions__element text-inherit"
                >
                    <UiDropdownActionsButton
                        icon="fa-solid fa-external-link"
                        label="Перейти в компанию"
                        :disabled="!object.complex_id"
                    />
                </RouterLink>
            </template>
        </UiDropdownActions>
    </div>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useSurveyForm } from '@/composables/useSurveyForm';
import { useMessenger } from '@/components/Messenger/useMessenger';
import { messenger } from '@/const/messenger';
import { IndustryObject } from '@/components/ObjectMapPopup/types';

const emit = defineEmits<{
    (e: 'chat-opened'): void;
    (e: 'survey-opened'): void;
}>();

const props = defineProps<{
    object: IndustryObject;
}>();

const { openSurvey } = useSurveyForm();
const { openChat } = useMessenger();

function openInChat() {
    openChat(props.object.company_id, props.object.id, messenger.dialogTypes.OBJECT);
    emit('chat-opened');
}

function openInSurvey() {
    openSurvey(props.object.company_id);
    emit('survey-opened');
}
</script>
<style lang="scss">
.object-map-popup {
    &__footer {
        display: flex;
        align-items: center;
        gap: 10px;
    }
}
</style>
