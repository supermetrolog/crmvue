<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        relative
        :width="550"
        small
        :title="`Действия над задачей (${count})`"
    >
        <Spinner v-if="isLoading" class="absolute-center" label="Загрузка истории.." />
        <template v-else>
            <div v-if="histories.length" ref="listNode" class="task-card__comments-list">
                <div class="task-card__list position-relative">
                    <TaskCardHistory
                        v-for="history in histories"
                        :key="history.id"
                        :history="history"
                    />
                </div>
            </div>
            <EmptyLabel v-else>Действия отсутствуют</EmptyLabel>
            <TaskCardButton class="ml-auto">Закрыть</TaskCardButton>
        </template>
        <template #actions="{ close }">
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" small>Закрыть</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import api from '@/api/api.js';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import { onMounted, shallowRef, useTemplateRef } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import TaskCardHistory from '@/components/TaskCard/History/TaskCardHistoryItem.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['close']);
const props = defineProps({
    taskId: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
});

const histories = shallowRef([]);

const { isLoading } = useDelayedLoader(true);
const listNode = useTemplateRef('listNode');

async function fetchHistory() {
    isLoading.value = true;

    const response = await api.task.history(props.taskId);

    if (response) {
        histories.value = response;
    }

    isLoading.value = false;
}

// watch(
//     () => listNode.value,
//     () => {
//         scrollToEnd();
//     }
// );

// const scrollToEnd = async () => {
//     listNode.value.scrollTop = listNode.value.scrollHeight;
// };

onMounted(fetchHistory);
</script>
