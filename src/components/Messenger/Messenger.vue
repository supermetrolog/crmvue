<template>
    <div class="messenger" :class="{ active: isOpen, 'has-panel': hasPanel }">
        <teleport to="body">
            <AnimationTransition :speed="0.7">
                <div
                    v-if="isOpen && hasPanel"
                    @click="isOpen = false"
                    class="messenger-backdrop"
                ></div>
            </AnimationTransition>
            <MessengerAttachment ref="attachments" />
            <FormModalChatMemberLastCall />
            <MessengerTaskPreview />
            <FormModalMessage />
        </teleport>
        <MessengerBar @select="selectTab" :current="currentAsideTab" />
        <div v-if="isActive" ref="body" class="messenger__content">
            <MessengerAside :current-tab="currentAsideTab" />
            <MessengerPanel :current-tab="currentContentTab" />
            <MessengerChat :current-tab="currentContentTab" />
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
import { useNotify } from '@/utils/use/useNotify.js';
import { messenger } from '@/const/messenger.js';
import MessengerTaskPreview from '@/components/Messenger/MessengerTaskPreview.vue';
import FormModalMessage from '@/components/Forms/FormModalMessage.vue';
import { createMessengerContext } from '@/components/Messenger/useMessengerContext.js';

const store = useStore();
const notify = useNotify();

const attachments = ref(null);
const isOpen = shallowRef(false);
const hasPanel = shallowRef(false);
const isActive = shallowRef(false);
const timeout = shallowRef(null);

const { currentAsideTab, filters, currentContentTab } = createMessengerContext();

provide('$openAttachments', () => attachments.value?.open());

const currentAsideDialogID = computed(() => store.state.Messenger.currentAsideDialogID);
const currentPanelCompanyID = computed(() => store.state.Messenger.currentPanelCompanyID);

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

const openChat = async (companyID, objectID, modelType = 'object', type = null) => {
    const query = { model_type: modelType };

    switch (modelType) {
        case 'object': {
            query.object_id = objectID;
            query.type = type;
            break;
        }
        case 'request': {
            query.model_id = objectID;
            break;
        }
        case 'company': {
            query.model_id = objectID;
            break;
        }
        case 'user': {
            query.model_id = objectID;
            break;
        }
        default: {
            notify.info('Данные по объекту не были найдены в чате');
            return;
        }
    }

    const dialog = await api.messenger.getDialogByQuery(query);

    if (!dialog) {
        notify.info('Данные по объекту не были найдены в чате');
        return;
    }

    currentContentTab.value = currentAsideTab.name;

    if (
        messenger.tabsGroups[modelType] !==
        messenger.tabsGroups[store.state.Messenger.currentDialogType]
    )
        store.state['Messenger/currentPanel'] = null;

    store.commit('Messenger/setCurrentAsidePanel', dialog.model_type);
    store.state['Messenger/currentContentPanel'] = dialog.model_type;

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

    currentAsideTab.name = dialog.model_type;
    isOpen.value = true;

    return true;
};

const openChatByID = async chatMemberID => {
    const dialog = await api.messenger.getDialog(chatMemberID);

    if (!dialog) {
        notify.info('Данные о чате не были найдены в системе.');
        return false;
    }

    const params = {
        dialogID: dialog.id,
        dialogType: dialog.model_type,
        anywayOpen: true
    };

    switch (dialog.model_type) {
        case 'object': {
            params.companyID = dialog.model.object.company_id;
            break;
        }
        case 'request': {
            params.companyID = dialog.model.company_id;
            break;
        }
        case 'company': {
            params.companyID = dialog.model.id;
            break;
        }
        case 'user': {
            params.userID = dialog.model.id;
            store.commit('Messenger/setCurrentAsidePanel', messenger.tabs.USERS);
            store.state['Messenger/currentContentPanel'] = messenger.tabs.USERS;
            break;
        }
    }

    store.state['Messenger/currentPanel'] = null;
    currentAsideTab.name = dialog.model_type;
    currentContentTab.value = dialog.model_type;
    isOpen.value = true;

    store.dispatch('Messenger/selectPanel', params);
    store.dispatch('Messenger/selectChat', params);

    return true;
};

const selectTab = (tab, tabSorting = null) => {
    const oldTab = {
        name: currentAsideTab.name,
        sort: currentAsideTab.sort
    };

    if (oldTab.name !== tab) {
        currentAsideTab.name = tab;
        currentAsideTab.sort = null;
    }

    if (tabSorting === currentAsideTab.sort && oldTab.name === tab) {
        currentAsideTab.sort = null;
    } else if (tabSorting !== null) {
        currentAsideTab.sort = tabSorting;
    }

    if (tabSorting) filters[tab] = {};

    store.commit('Messenger/setCurrentAsidePanel', tab);

    if (tab !== null && messenger.tabsGroups[tab] !== messenger.tabsGroups[oldTab.name]) {
        store.state['Messenger/currentPanel'] = null;
    }

    if (oldTab.name === null || isOpen.value === false) isOpen.value = true;
    else if (tab === oldTab.name && tabSorting === null) isOpen.value = false;
};

const openChatByCompanyID = companyID => {
    store.state['Messenger/currentPanel'] = null;

    currentAsideTab.name = messenger.tabs.OBJECTS;
    currentContentTab.name = messenger.tabs.OBJECTS;

    isOpen.value = true;
    store.dispatch('Messenger/selectPanelWithoutDialog', companyID);

    return true;
};

const openChatByUserID = async userId => {
    const dialog = await api.messenger.getDialogByQuery({
        user_id: userId,
        model_type: messenger.dialogTypes.USER
    });

    if (!dialog) {
        notify.info('Данные о чате не были найдены в системе.');
        return;
    }

    currentAsideTab.name = messenger.tabs.USERS;
    currentContentTab.name = messenger.tabs.USERS;

    store.commit('Messenger/setCurrentAsidePanel', messenger.tabs.USERS);
    store.state['Messenger/currentContentPanel'] = messenger.tabs.USERS;
    store.state['Messenger/currentPanel'] = null;

    isOpen.value = true;

    store.dispatch('Messenger/selectPanel', {
        userID: dialog.model.id,
        dialogID: dialog.id,
        dialogType: dialog.model_type,
        anywayOpen: true
    });

    store.dispatch('Messenger/selectChat', {
        userID: dialog.model.id,
        dialogID: dialog.id,
        dialogType: dialog.model_type,
        anywayOpen: true
    });

    return true;
};

const openSurvey = async (dialogType, objectId, companyID, type = null) => {
    const dialogQuery = { model_type: dialogType };

    switch (dialogType) {
        case messenger.dialogTypes.OBJECT: {
            dialogQuery.object_id = objectId;
            dialogQuery.type = type;
            break;
        }
        case messenger.dialogTypes.REQUEST: {
            dialogQuery.model_id = objectId;
            break;
        }
        case messenger.dialogTypes.COMPANY: {
            dialogQuery.model_id = objectId;
            break;
        }
        default: {
            notify.info('Опросник для данного типа чатов не поддерживается');
            return false;
        }
    }

    const dialog = await api.messenger.getDialogByQuery(dialogQuery);

    if (!dialog) {
        notify.info('Чат не был найден в системе.');
        return false;
    }

    store.commit('Messenger/setCurrentAsidePanel', dialog.model_type);
    store.state['Messenger/currentContentPanel'] = dialog.model_type;

    currentAsideTab.name = dialog.model_type;
    currentContentTab.name = dialog.model_type;

    isOpen.value = true;

    store.dispatch('Messenger/selectPanel', {
        dialogType,
        companyID,
        dialogID: dialog.id,
        anywayOpen: true
    });

    store.dispatch('Messenger/selectSurvey', {
        dialogType,
        dialogID: dialog.id
    });

    return true;
};

defineExpose({ openChat, openChatByID, openChatByCompanyID, openChatByUserID, openSurvey });

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
