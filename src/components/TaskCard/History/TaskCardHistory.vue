<template>
    <div>
        <Spinner v-if="isLoading" class="small absolute-center" label="Загрузка истории.." />
        <div v-else-if="histories.length" class="task-card__comments-list task-card__histories">
            <div class="task-card__list position-relative">
                <TaskCardHistoryItem
                    v-for="(history, index) in histories"
                    :key="history.id"
                    :history="history"
                    :prev="history.prev_id ? histories[index + 1] : null"
                />
            </div>
        </div>
        <p v-else>История отсутствует..</p>
    </div>
</template>

<script setup>
import api from '@/api/api.js';
import { onMounted, shallowRef, watch } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import TaskCardHistoryItem from '@/components/TaskCard/History/TaskCardHistoryItem.vue';

const emit = defineEmits(['created']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const { isLoading } = useDelayedLoader(true);
const histories = shallowRef([]);

watch(() => props.task.updated_at, fetchHistories);

async function fetchHistories() {
    isLoading.value = true;

    const response = await api.task.history(props.task.id);

    if (response) {
        histories.value = response.toReversed();
        if (histories.value.length !== props.task.histories_count)
            emit('created', histories.value.length);
    }

    isLoading.value = false;
}

onMounted(fetchHistories);
</script>
