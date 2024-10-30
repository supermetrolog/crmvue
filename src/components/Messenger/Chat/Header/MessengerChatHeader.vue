<template>
    <div class="messenger-chat-header">
        <div class="messenger-chat-header__body">
            <component :is="currentComponentName" :dialog="currentDialog" />
        </div>
        <div class="messenger-chat-header__functions">
            <a
                v-if="currentDialog.model_type === 'object' && linkToObject"
                v-tippy="'Открыть на сайте'"
                :href="linkToObject"
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
import { ucFirst } from '@/utils/formatter.js';
import { getLinkComplex } from '@/utils/url.js';
import MessengerChatHeaderObject from '@/components/Messenger/Chat/Header/MessengerChatHeaderObject.vue';
import MessengerChatHeaderRequest from '@/components/Messenger/Chat/Header/MessengerChatHeaderRequest.vue';
import MessengerChatHeaderUser from '@/components/Messenger/Chat/Header/MessengerChatHeaderUser.vue';
import MessengerChatHeaderCompany from '@/components/Messenger/Chat/Header/MessengerChatHeaderCompany.vue';

const COMPONENTS = {
    MessengerChatHeaderObject: MessengerChatHeaderObject,
    MessengerChatHeaderRequest: MessengerChatHeaderRequest,
    MessengerChatHeaderUser: MessengerChatHeaderUser,
    MessengerChatHeaderCompany: MessengerChatHeaderCompany
};

const store = useStore();

const $toggleSettings = inject('$toggleSettings');

const currentDialog = computed(() => store.state.Messenger.currentDialog);
const currentComponentName = computed(
    () => COMPONENTS['MessengerChatHeader' + ucFirst(currentDialog.value.model_type)]
);
const linkToObject = computed(() => {
    if (currentDialog.value.model.object.complex_id)
        return getLinkComplex(currentDialog.value.model.object.complex_id);
    return null;
});
</script>
