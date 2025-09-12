<template>
    <div class="messenger-chat-header">
        <div class="messenger-chat-header__body">
            <component :is="currentComponentName" :dialog="currentDialog" />
        </div>
        <div class="messenger-chat-header__functions">
            <a
                v-if="linkToChatMember"
                v-tippy="'Открыть на сайте'"
                :href="linkToChatMember"
                target="_blank"
                class="messenger-chat-header__function rounded-icon"
            >
                <i class="fa-solid fa-up-right-from-square"></i>
            </a>
            <button
                v-tippy="'Открыть панель чата'"
                @click="$toggleSettings"
                class="messenger-chat-header__function rounded-icon"
            >
                <i class="fa-solid fa-table-columns"></i>
            </button>
        </div>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, inject } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { getLinkCompany, getLinkComplex, getTimelineLink } from '@/utils/url.js';
import MessengerChatHeaderObject from '@/components/Messenger/Chat/Header/MessengerChatHeaderObject.vue';
import MessengerChatHeaderRequest from '@/components/Messenger/Chat/Header/MessengerChatHeaderRequest.vue';
import MessengerChatHeaderUser from '@/components/Messenger/Chat/Header/MessengerChatHeaderUser.vue';
import MessengerChatHeaderCompany from '@/components/Messenger/Chat/Header/MessengerChatHeaderCompany.vue';
import { messenger } from '@/const/messenger.js';
import { useAuth } from '@/composables/useAuth';

const COMPONENTS = {
    MessengerChatHeaderObject: MessengerChatHeaderObject,
    MessengerChatHeaderRequest: MessengerChatHeaderRequest,
    MessengerChatHeaderUser: MessengerChatHeaderUser,
    MessengerChatHeaderCompany: MessengerChatHeaderCompany
};

const store = useStore();
const { currentUserId } = useAuth();

const $toggleSettings = inject('$toggleSettings');

const currentDialog = computed(() => store.state.Messenger.currentDialog);
const currentComponentName = computed(
    () => COMPONENTS['MessengerChatHeader' + ucFirst(currentDialog.value.model_type)]
);
const linkToChatMember = computed(() => {
    if (currentDialog.value.model?.object?.complex_id)
        return getLinkComplex(currentDialog.value.model.object.complex_id);

    if (currentDialog.value.model_type === messenger.dialogTypes.COMPANY)
        return getLinkCompany(currentDialog.value.model.id);

    if (currentDialog.value.model_type === messenger.dialogTypes.REQUEST) {
        return getTimelineLink(
            currentDialog.value.model.company_id,
            currentDialog.value.model.id,
            currentUserId.value
        );
    }

    return null;
});
</script>
