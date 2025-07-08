<template>
    <div>
        <MessengerDialogLastMessage
            v-if="lastMessageShouldBeVisible"
            @click="$emit('show-message', company.pinned_messages[0].message)"
            :last-message="company.pinned_messages[0].message"
            class="company-table-item__message w-100"
            hide-avatar
            column
        >
            <template #before>
                <span class="company-table-item__message-label">Закреплено,</span>
            </template>
            <template #after>
                <UiDropdownActions small label="Действия над сообщением" class="ml-auto">
                    <template #menu>
                        <UiDropdownActionsButton
                            @handle="$emit('create-pinned-message')"
                            label="Добавить новое сообщение"
                            icon="fa-solid fa-plus"
                        />
                        <UiDropdownActionsButton
                            @handle="$emit('unpin-message', company.pinned_messages[0])"
                            label="Открепить сообщение"
                            icon="fa-solid fa-trash"
                        />
                    </template>
                </UiDropdownActions>
            </template>
        </MessengerDialogLastMessage>
        <UiButton
            v-if="messagesCountButtonShouldBeVisible"
            @click="modalIsVisible = true"
            small
            class="mt-2 fs-2"
            color="transparent"
        >
            {{ messagesCountLabel }}
        </UiButton>
        <UiModal
            v-model:visible="modalIsVisible"
            :title="`Закрепленные сообщения (${company.pinned_messages.length}) | ${company.full_name}`"
            :width="600"
        >
            <div class="d-flex flex-column gap-2">
                <MessengerDialogLastMessage
                    v-for="message in company.pinned_messages"
                    :key="message.id"
                    @click="$emit('show-message', message.message)"
                    :last-message="message.message"
                    class="company-table-item__message w-100"
                    hide-avatar
                    column
                >
                    <template #after>
                        <UiDropdownActions small label="Действия над сообщением" class="ml-auto">
                            <template #menu>
                                <UiDropdownActionsButton
                                    @handle="$emit('unpin-message', message)"
                                    label="Открепить сообщение"
                                    icon="fa-solid fa-trash"
                                />
                            </template>
                        </UiDropdownActions>
                    </template>
                </MessengerDialogLastMessage>
            </div>
        </UiModal>
    </div>
</template>

<script setup>
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import MessengerDialogLastMessage from '@/components/Messenger/Dialog/MessengerDialogLastMessage.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed, ref } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { plural } from '@/utils/plural.js';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { isEmptyString } from '@/utils/helpers/string/isEmptyString.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

defineEmits(['create-pinned-message', 'show-message', 'unpin-message']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const modalIsVisible = ref(false);

const lastMessageShouldBeVisible = computed(() => {
    return props.company.pinned_messages[0].message.message !== props.company.last_survey?.comment;
});

const messagesCountLabel = computed(() =>
    plural(
        props.company.pinned_messages.length - 1 || 1,
        '+ еще %d закрепленное сообщение',
        '+ еще %d закрепленных сообщения',
        '+ еще %d закрепленных сообщений'
    )
);

const messagesCountButtonShouldBeVisible = computed(() => {
    if (props.company.pinned_messages.length > 2) return true;

    if (isNotNullish(props.company.last_survey)) {
        if (
            isNullish(props.company.last_survey.comment) ||
            isEmptyString(props.company.last_survey.comment)
        ) {
            return props.company.pinned_messages.length > 1;
        } else {
            return props.company.pinned_messages.length > 2;
        }
    }

    return props.company.pinned_messages.length > 1;
});
</script>
