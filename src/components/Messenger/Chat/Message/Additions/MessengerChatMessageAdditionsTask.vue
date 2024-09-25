<template>
    <MessengerChatMessageAdditionsItem
        :class="{
            completed: isCompleted,
            expired: isExpired,
            observing: isObserving,
            observed: isObserved
        }"
    >
        <template v-if="isObserving" #functions>
            <span
                v-tippy="observingText"
                @click="read"
                class="messenger-chat-message-addition__observing rounded-icon"
                :class="{ observed: isObserved, loading: addition.isLoading }"
            >
                <i class="fa-solid fa-eye"></i>
            </span>
        </template>
        <template #icon>
            <span
                v-tippy="addition.message"
                @click="showPreview"
                class="messenger-chat-message-addition__icon rounded-icon bg-black"
                :class="{ completed: isCompleted }"
            >
                <i class="fa-solid fa-bolt"></i>
            </span>
        </template>
        <template #additionalIcons>
            <Avatar
                v-for="observer in observers"
                :key="observer.id"
                class="messenger-chat-message-addition__observer"
                :class="{ viewed: observer.viewed_at !== null }"
                :label="observer.user.userProfile.medium_name + ' наблюдает'"
                :size="30"
                :src="observer.user.userProfile.avatar"
            />
            <Tippy interactive>
                <div
                    v-if="addition.observers.length > 3"
                    class="messenger-chat-message-addition__circle"
                >
                    +{{ observersDiff }}
                </div>
                <template #content>
                    <p class="mb-1">Список всех наблюдателей:</p>
                    <div class="d-flex gap-1 flex-wrap">
                        <Avatar
                            v-for="observer in addition.observers"
                            :key="observer.id"
                            class="messenger-chat-message-addition__observer"
                            :class="{ viewed: observer.viewed_at !== null }"
                            :label="observer.user.userProfile.medium_name + ' наблюдает'"
                            :size="30"
                            :src="observer.user.userProfile.avatar"
                        />
                    </div>
                </template>
            </Tippy>
        </template>
        <template #content>
            Задача #{{ addition.id }} для {{ usersText }} до {{ expiredDate }}
        </template>
        <template v-if="isCompleted" #external>
            <DashboardChip class="dashboard-bg-success text-white">Выполнено</DashboardChip>
        </template>
    </MessengerChatMessageAdditionsItem>
</template>
<script setup>
import dayjs from 'dayjs';
import MessengerChatMessageAdditionsItem from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsItem.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { taskOptions } from '@/const/options/task.options.js';
import Avatar from '@/components/common/Avatar.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { Tippy } from 'vue-tippy';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

const emit = defineEmits(['read']);
const props = defineProps({
    addition: {
        type: Object,
        required: true
    },
    editable: {
        type: Boolean,
        default: false
    },
    draggable: {
        type: Boolean,
        default: false
    }
});

const { show: showTaskPreviewer } = useAsyncPopup('messengerTaskPreview');

const store = useStore();

const usersText = computed(() => props.addition.user.userProfile.middle_name);
const expiredDate = computed(() => dayjs(props.addition.end).format('DD.MM.YYYY'));
const isExpired = computed(() => dayjs(props.addition.end).diff(dayjs(), 'day') <= 3);
const isCompleted = computed(
    () =>
        props.addition.status === taskOptions.statusTypes.COMPLETED ||
        props.addition.status === taskOptions.statusTypes.CANCELED
);

const isObserving = computed(() => {
    return props.addition.observers.some(
        observer => observer.user_id === store.getters.THIS_USER.id
    );
});

const isObserved = computed(() => {
    return props.addition.observers.some(
        observer => observer.user_id === store.getters.THIS_USER.id && observer.viewed_at !== null
    );
});
const observingText = computed(() => {
    if (props.addition.isLoading) return 'Чтение.. Ожидайте';
    if (isObserved.value) return 'Просмотрено';
    return 'Нажмите, чтобы отметить задачу просмотренной';
});

const observers = computed(() => props.addition.observers.slice(0, 3));
const observersDiff = computed(() => props.addition.observers.length - 3);

const showPreview = async () => {
    const task = await showTaskPreviewer({ task: props.addition });
    if (task) Object.assign(props.addition, task);
};

const read = () => {
    if (isObserving.value && !isObserved.value && !props.addition.isLoading) emit('read');
};
</script>
