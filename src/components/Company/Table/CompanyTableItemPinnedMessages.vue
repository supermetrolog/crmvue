<template>
    <div>
        <MessengerDialogLastMessage
            v-if="!company.last_survey"
            @click="$emit('show-message', company.pinned_messages[0].message)"
            :last-message="company.pinned_messages[0].message"
            class="company-table-item__message w-100"
            hide-avatar
            column
        >
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

defineEmits(['create-pinned-message', 'show-message', 'unpin-message']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const modalIsVisible = ref(false);

const messagesCountLabel = computed(() =>
    plural(
        props.company.pinned_messages.length - 1 || 1,
        '+ еще %d закрепленное сообщение',
        '+ еще %d закрепленных сообщения',
        '+ еще %d закрепленных сообщений'
    )
);

const messagesCountButtonShouldBeVisible = computed(() => {
    return (
        props.company.pinned_messages.length > 1 ||
        (!props.company.last_survey?.comment && !props.company.pinned_messages.length)
    );
});
</script>
