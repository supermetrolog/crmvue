<template>
    <div class="task-card-history-event__content">
        <div class="task-card-history-event__column">
            <TaskCardHistoryEventRow label="Наблюдатели">
                <div
                    v-if="snapshot.observers.length || prevSnapshot?.observers?.length"
                    class="task-card__chips"
                >
                    <DashboardChip
                        v-for="cacheItem in cache"
                        :key="cacheItem.id"
                        class="task-card__tag task-card-history-event__tag dashboard-bg-gray-l text-dark"
                        :class="{ deleted: cacheItem.deleted, added: cacheItem.added }"
                    >
                        <i v-if="cacheItem.deleted" class="fa-solid fa-minus mr-1"></i>
                        <i v-if="cacheItem.added" class="fa-solid fa-plus mr-1"></i>
                        <span>{{ cacheItem.observer.userProfile.medium_name }}</span>
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
    props.prevSnapshot.observers.map(observer => {
        cache.value[observer.id] = {
            id: observer.id,
            deleted: true,
            observer: observer
        };
    });
}

props.snapshot.observers.map(observer => {
    if (cache.value[observer.id]) {
        cache.value[observer.id].deleted = false;
    } else {
        cache.value[observer.id] = {
            id: observer.id,
            observer: observer,
            added: true
        };
    }
});
</script>
