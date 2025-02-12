<template>
    <div class="task-card-history-event__content">
        <div class="task-card-history-event__column">
            <TaskCardHistoryEventRow label="Файлы">
                <div
                    v-if="snapshot.files.length || prevSnapshot?.files?.length"
                    class="task-card__chips"
                >
                    <DashboardChip
                        v-for="cacheItem in cache"
                        :key="cacheItem.id"
                        class="task-card__tag task-card-history-event__tag dashboard-bg-gray-l text-dark deleted"
                    >
                        <i class="fa-solid fa-minus mr-1"></i>
                        <span>{{ cacheItem.file.original_name }}</span>
                    </DashboardChip>
                </div>
            </TaskCardHistoryEventRow>
        </div>
    </div>
</template>

<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import TaskCardHistoryEventRow from '@/components/TaskCard/History/TaskCardHistoryEventRow.vue';
import { shallowRef } from 'vue';

const props = defineProps({
    snapshot: {
        type: Object,
        required: true
    },
    prevSnapshot: {
        type: Object,
        required: true
    }
});

const cache = shallowRef({});

if (props.prevSnapshot) {
    props.prevSnapshot.files.map(file => {
        cache.value[file.id] = {
            id: file.id,
            file: file
        };
    });
}

props.snapshot.files.map(file => {
    if (cache.value[file.id]) {
        delete cache.value[file.id];
    }
});
</script>
