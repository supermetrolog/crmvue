<template>
    <div class="messenger" :class="classList">
        <teleport to="body">
            <AnimationTransition :speed="0.7">
                <div v-if="isOpen && hasPanel" class="messenger-backdrop"></div>
            </AnimationTransition>
            <MessengerAttachment ref="attachments" />
            <FormModalChatMemberLastCall />
        </teleport>
        <MessengerBar @click="isOpen = !isOpen" />
        <div v-if="isActive" ref="body" class="messenger__content">
            <MessengerAside class="messenger__aside" />
            <MessengerPanel class="messenger__panel" />
            <MessengerChat class="messenger__chat" />
        </div>
    </div>
</template>
<script setup>
import MessengerAside from '@/components/Messenger/Aside/MessengerAside.vue';
import MessengerChat from '@/components/Messenger/Chat/MessengerChat.vue';
import MessengerPanel from '@/components/Messenger/Panel/MessengerPanel.vue';
import MessengerBar from '@/components/Messenger/MessengerBar.vue';
import { useStore } from 'vuex';
import MessengerAttachment from '@/components/Messenger/MessengerAttachment.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import api from '@/api/api.js';
import FormModalChatMemberLastCall from '@/components/Forms/FormModalChatMemberLastCall.vue';
import {
    computed,
    onBeforeUnmount,
    onMounted,
    onUnmounted,
    provide,
    ref,
    shallowRef,
    watch
} from 'vue';
import { useNotify } from '@/utils/useNotify.js';

const store = useStore();
const notify = useNotify();

const attachments = ref(null);
const isOpen = shallowRef(false);
const hasPanel = shallowRef(false);
const isActive = shallowRef(false);
const timeout = shallowRef(null);

provide('$openAttachments', () => attachments.value?.open());

const currentAsideDialogID = computed(() => store.state.Messenger.currentAsideDialogID);
const currentPanelCompanyID = computed(() => store.state.Messenger.currentPanelCompanyID);

const classList = computed(() => ({
    active: isOpen.value,
    'has-panel': hasPanel.value
}));

watch(isOpen, value => {
    if (value) {
        isActive.value = true;

        if (timeout.value) {
            clearTimeout(timeout.value);
            timeout.value = null;
        }
    } else {
        if (!currentAsideDialogID.value && !currentPanelCompanyID.value) hasPanel.value = false;
    }
});

watch(
    [currentAsideDialogID, currentPanelCompanyID],
    ([dialogID, companyID]) => (hasPanel.value = hasPanel.value || dialogID || companyID)
);

const escapeHandler = event => {
    if (isActive.value && event.code === 'Escape') isOpen.value = false;
};

const openChat = async (companyID, objectID, modelType = 'object') => {
    const query = { model_type: modelType };

    if (modelType === 'object') query.object_id = objectID;
    else if (modelType === 'request') query.request_id = objectID;

    const dialog = await api.messenger.getDialogByQuery(query);

    if (!dialog) {
        notify.info('Данные по объекту не были найдены в чате');
        return;
    }

    isOpen.value = true;

    store.dispatch('Messenger/selectPanel', {
        companyID: companyID,
        dialogID: dialog.id,
        dialogType: modelType,
        anywayOpen: true
    });

    store.dispatch('Messenger/selectChat', {
        dialogID: dialog.id,
        companyID: companyID,
        dialogType: modelType,
        anywayOpen: true
    });

    return true;
};

const openChatByID = async chatMemberID => {
    const dialog = await api.messenger.getDialogByQuery({ id: chatMemberID });

    if (!dialog) {
        notify.info('Данные о чате не были найдены в системе.');
        return;
    }

    let companyID = null;

    switch (dialog.model_type) {
        case 'object': {
            companyID = dialog.model.object.company?.id;
            break;
        }
        case 'request': {
            companyID = dialog.model.company_id;
            break;
        }
        case 'user': {
            return;
        }
    }

    isOpen.value = true;

    store.dispatch('Messenger/selectPanel', {
        companyID: companyID,
        dialogID: dialog.id,
        dialogType: dialog.model_type,
        anywayOpen: true
    });

    store.dispatch('Messenger/selectChat', {
        dialogID: dialog.id,
        companyID: companyID,
        dialogType: dialog.model_type,
        anywayOpen: true
    });

    return true;
};

const openChatByCompanyID = companyID => {
    isOpen.value = true;
    store.dispatch('Messenger/selectPanelWithoutDialog', companyID);
    return true;
};

defineExpose({ openChat, openChatByID, openChatByCompanyID });

onMounted(() => {
    document.addEventListener('keydown', escapeHandler);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', escapeHandler);
});

onUnmounted(() => {
    store.commit('Messenger/clearState');
});
</script>
