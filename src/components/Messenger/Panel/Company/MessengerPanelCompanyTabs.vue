<template>
    <div class="messenger-panel-company__tabs">
        <MessengerPanelCompanyTab
            title="Контакты"
            :total-count="company.contacts_count"
            :active-count="company.active_contacts_count"
        >
            <MessengerPanelCompanyContacts :company-id="company.id" />
        </MessengerPanelCompanyTab>
        <MessengerPanelCompanyTab
            title="Объекты"
            :total-count="company.objects_count"
            :opened="isOpened.object"
        >
            <MessengerPanelCompanyObjects :companyID="company.id" />
        </MessengerPanelCompanyTab>
        <MessengerPanelCompanyTab
            title="Запросы"
            :total-count="company.requests_count"
            :active-count="company.active_requests_count"
            :opened="isOpened.request"
        >
            <MessengerPanelCompanyRequests :companyID="company.id" />
        </MessengerPanelCompanyTab>
        <MessengerPanelCompanyTab title="Услуги">
            <InProgress />
        </MessengerPanelCompanyTab>
        <MessengerPanelCompanyTab title="Сделки">
            <InProgress />
        </MessengerPanelCompanyTab>
    </div>
</template>
<script setup>
import InProgress from '@/components/common/InProgress.vue';
import { useStore } from 'vuex';
import MessengerPanelCompanyObjects from '@/components/Messenger/Panel/Company/MessengerPanelCompanyObjects.vue';
import MessengerPanelCompanyRequests from '@/components/Messenger/Panel/Company/MessengerPanelCompanyRequests.vue';
import { computed, onBeforeMount, provide, ref, shallowReactive, useTemplateRef } from 'vue';
import MessengerPanelCompanyTab from '@/components/Messenger/Panel/Company/MessengerPanelCompanyTab.vue';
import MessengerPanelCompanyContacts from '@/components/Messenger/Panel/Company/MessengerPanelCompanyContacts.vue';

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const store = useStore();

const lastRenderedObjectsCount = ref(1);
const isOpened = shallowReactive({
    object: false,
    request: false
});

provide('lastRenderedObjectCount', () => lastRenderedObjectsCount.value);
provide('setLastRendererObjectCount', () => value => setLastRendererObjectCount(value));

const currentPanelCompanyID = computed(() => store.state.Messenger.currentPanelCompanyID);
const currentDialogType = computed(() => store.state.Messenger.currentDialogType);
const setLastRendererObjectCount = value => {
    lastRenderedObjectsCount.value = value;
};

onBeforeMount(() => {
    if (currentPanelCompanyID.value === props.company.id) {
        isOpened[currentDialogType.value] = true;
    }
});
</script>
