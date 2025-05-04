<template>
    <div class="messenger-chat-header">
        <div class="messenger-chat-header__body">
            <component :is="currentComponentName" :dialog />
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
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { getLinkCompany, getLinkComplex, getTimelineLink } from '@/utils/url.js';
import MessengerChatHeaderObject from '@/components/Messenger/Chat/Header/MessengerChatHeaderObject.vue';
import MessengerChatHeaderRequest from '@/components/Messenger/Chat/Header/MessengerChatHeaderRequest.vue';
import MessengerChatHeaderUser from '@/components/Messenger/Chat/Header/MessengerChatHeaderUser.vue';
import MessengerChatHeaderCompany from '@/components/Messenger/Chat/Header/MessengerChatHeaderCompany.vue';
import { messenger } from '@/const/messenger.js';
import { useAuth } from '@/composables/useAuth.js';

const props = defineProps({
    dialog: Object
});

const COMPONENTS = {
    MessengerChatHeaderObject: MessengerChatHeaderObject,
    MessengerChatHeaderRequest: MessengerChatHeaderRequest,
    MessengerChatHeaderUser: MessengerChatHeaderUser,
    MessengerChatHeaderCompany: MessengerChatHeaderCompany
};

const { currentUserId } = useAuth();

const currentComponentName = computed(
    () => COMPONENTS['MessengerChatHeader' + ucFirst(props.dialog.model_type)]
);

const linkToChatMember = computed(() => {
    if (props.dialog.model?.object?.complex_id) {
        return getLinkComplex(props.dialog.model.object.complex_id);
    }

    if (props.dialog.model_type === messenger.dialogTypes.COMPANY) {
        return getLinkCompany(props.dialog.model.id);
    }

    if (props.dialog.model_type === messenger.dialogTypes.REQUEST) {
        return getTimelineLink(
            props.dialog.model.company_id,
            props.dialog.model.id,
            currentUserId.value
        );
    }

    return null;
});
</script>
