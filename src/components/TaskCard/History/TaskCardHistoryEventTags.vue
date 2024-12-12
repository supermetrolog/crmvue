<template>
    <div class="task-card-history-event__content">
        <div class="task-card-history-event__column">
            <TaskCardHistoryEventRow label="Тэги">
                <div
                    v-if="snapshot.tags.length || prevSnapshot?.tags?.length"
                    class="task-card__chips"
                >
                    <DashboardChip
                        v-for="tag in cache"
                        :key="tag.id"
                        class="task-card__tag task-card-history-event__tag dashboard-bg-gray-l text-dark"
                        :class="{ deleted: tag.deleted, added: tag.added }"
                    >
                        <i v-if="tag.deleted" class="fa-solid fa-minus mr-1"></i>
                        <i v-if="tag.added" class="fa-solid fa-plus mr-1"></i>
                        <span>{{ tag.name ?? tag.label }}</span>
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
    props.prevSnapshot.tags.map(tag => {
        cache.value[tag.id] = {
            id: tag.id,
            color: tag.color,
            name: tag.name,
            label: tag.label,
            deleted: true
        };
    });
}

props.snapshot.tags.map(tag => {
    if (cache.value[tag.id]) {
        cache.value[tag.id].deleted = false;
    } else {
        cache.value[tag.id] = {
            id: tag.id,
            color: tag.color,
            name: tag.name,
            label: tag.label,
            added: true
        };
    }
});
</script>
