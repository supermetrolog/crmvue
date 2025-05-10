<template>
    <div class="header-summary-messages-content-preview position-relative">
        <HeaderSummaryMessagesContentHeader
            @to-chat="$emit('to-chat')"
            :dialog
            class="header-summary-messages-content-preview__header"
        />
        <Loader v-if="isFetching" label="Загрузка сообщений" />
        <HeaderSummaryMessagesContentVirtual
            v-else
            @load="loadMessages"
            @read="readMessage"
            :messages
            :loading="isLoading"
            :finished="isFinished"
            class="header-summary-messages-content-preview__list"
        />
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import api from '@/api/api.js';
import Loader from '@/components/common/Loader.vue';
import { debounce } from '@/utils/common/debounce.js';
import { messagesToSections } from '@/utils/mapper.js';
import HeaderSummaryMessagesContentHeader from '@/components/Header/Summary/Messages/HeaderSummaryMessagesContentHeader.vue';
import HeaderSummaryMessagesContentVirtual from '@/components/Header/Summary/Messages/HeaderSummaryMessagesContentVirtual.vue';

const emit = defineEmits(['close', 'to-chat', 'read']);
const props = defineProps({
    dialog: Object
});

function unshiftMessages(value) {
    const { messages: newMessages, hasLeakedMessages } = messagesToSections(
        value,
        messages.value[0].label
    );

    if (hasLeakedMessages) messages.value.splice(0, 1);
    messages.value.unshift(...newMessages);
}

// fetch

const isFetching = ref(false);
const messages = ref([]);

async function fetchMessages() {
    isFetching.value = true;

    const response = await api.messenger.getMessages(props.dialog.id);

    if (response) {
        lessThenMessageId.value = response[0].id;
        messages.value = messagesToSections(response).messages;
    }

    isFetching.value = false;
}

onMounted(fetchMessages);

watch(
    () => props.dialog?.id,
    value => {
        if (value) fetchMessages();
    }
);

// load

const isFinished = ref(false);
const isLoading = ref(false);
const lessThenMessageId = ref(null);

async function loadMessages() {
    isLoading.value = true;
    const response = await api.messenger.getMessages(props.dialog.id, lessThenMessageId.value);

    if (response?.length) {
        unshiftMessages(response);
        lessThenMessageId.value = response[0].id;

        isLoading.value = false;
        isFinished.value = response.length < 30;
    } else {
        isLoading.value = false;
        isFinished.value = true;
    }
}

// read

const readMessage = debounce(async messageID => {
    // const reads = await api.messenger.readMessages(messageID);
    // if (reads) {
    //     emit('read');
    // }
}, 2000);
</script>
