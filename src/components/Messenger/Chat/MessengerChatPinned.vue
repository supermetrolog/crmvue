<template>
    <div class="messenger-chat-pinned">
        <i class="fa-solid fa-lock"></i>
        <UiTooltipIcon
            @click="viewIsOpened = true"
            tooltip="Перейти к сообщению"
            icon="fa-solid fa-up-right-from-square"
            class="c-pointer"
        />
        <div
            class="messenger-chat-pinned__text"
            v-html="message.message?.length ? message.message : fileNames"
        ></div>
        <span class="messenger-chat-pinned__date">{{ createdAt }}</span>
        <UiTooltipIcon
            @click="unpin"
            tooltip="Открепить сообщение"
            icon="fa-solid fa-xmark"
            class="c-pointer"
        />
        <MessengerChatPinnedView v-if="viewIsOpened" @close="viewIsOpened = false" />
    </div>
</template>
<script setup>
import { plural } from '@/utils/plural.js';
import MessengerChatPinnedView from '@/components/Messenger/Chat/MessengerChatPinnedView.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { computed, ref } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import { useNotify } from '@/utils/use/useNotify.js';
import { useStore } from 'vuex';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const { confirm } = useConfirm();
const notify = useNotify();
const store = useStore();

const viewIsOpened = ref(false);

const fileNames = computed(() => {
    return `${plural(
        props.message.files.length,
        '%d файл',
        '%d файла',
        '%d файлов'
    )}: ${props.message.files.map(attachment => attachment.name).join(', ')}`;
});

const createdAt = computed(() => toDateFormat(props.message.created_at));

const unpin = async () => {
    const confirmed = await confirm(
        'Открепить сообщение',
        'Вы уверены, что хотите открепить сообщение?'
    );
    if (!confirmed) return;

    const unpinned = await store.dispatch('Messenger/unpinMessage');
    if (unpinned) notify.success('Сообщение успешно откреплено');
};
</script>
