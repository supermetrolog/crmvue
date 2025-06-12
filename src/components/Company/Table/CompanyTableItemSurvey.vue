<template>
    <div>{{ company.last_survey.created_at }}</div>
    <!--    <MessengerDialogLastMessage-->
    <!--        @click="$emit('show-message', company.chat_member_pinned_message)"-->
    <!--        :last-message="company.chat_member_pinned_message"-->
    <!--        class="company-table-item__message w-100"-->
    <!--        hide-avatar-->
    <!--        column-->
    <!--    >-->
    <!--        <template #after>-->
    <!--            <UiDropdownActions small label="Действия над сообщением" class="ml-auto">-->
    <!--                <template #menu>-->
    <!--                    <UiDropdownActionsButton-->
    <!--                        @handle="$emit('create-pinned-message')"-->
    <!--                        label="Добавить новое сообщение"-->
    <!--                        icon="fa-solid fa-plus"-->
    <!--                    />-->
    <!--                    <UiDropdownActionsButton-->
    <!--                        @handle="-->
    <!--                                        $emit('unpin-message', company.chat_member_pinned_message)-->
    <!--                                    "-->
    <!--                        label="Открепить сообщение"-->
    <!--                        icon="fa-solid fa-trash"-->
    <!--                    />-->
    <!--                </template>-->
    <!--            </UiDropdownActions>-->
    <!--        </template>-->
    <!--    </MessengerDialogLastMessage>-->
    <!--    <p class="text-center">&#8212;</p>-->
    <!--    <UiButton-->
    <!--        @click="$emit('create-pinned-message')"-->
    <!--        class="company-table-item__comment-button"-->
    <!--        color="light"-->
    <!--        small-->
    <!--        icon="fa-solid fa-plus"-->
    <!--    >-->
    <!--        Добавить сообщение-->
    <!--    </UiButton>-->
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import UiButton from '@/components/common/UI/UiButton.vue';

const store = useStore();
const router = useRouter();

defineEmits([]);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});
</script>
