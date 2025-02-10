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
                        class="task-card__tag task-card-history-event__tag dashboard-bg-gray-l text-dark"
                        :class="{ deleted: cacheItem.deleted, added: cacheItem.added }"
                    >
                        <i v-if="cacheItem.deleted" class="fa-solid fa-minus mr-1"></i>
                        <i v-if="cacheItem.added" class="fa-solid fa-plus mr-1"></i>
                        <span>{{ cacheItem.file.original_name }}</span>
                        <i
                            v-if="!cacheItem.file.deleted_at"
                            v-tippy="'Открыть изображение'"
                            @click="openFile(cacheItem.file)"
                            class="fa-solid fa-arrow-up-right-from-square ml-1 c-pointer"
                        />
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
import { isImageMedia } from '@/utils/helpers/models/media.js';
import { usePreviewer } from '@/composables/usePreviewer.js';

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
            deleted: true,
            file: file
        };
    });
}

props.snapshot.files.map(file => {
    if (cache.value[file.id]) {
        cache.value[file.id].deleted = false;
    } else {
        cache.value[file.id] = {
            id: file.id,
            file: file,
            added: true
        };
    }
});

// files

const { preview } = usePreviewer();

function openFile(media) {
    if (isImageMedia(media)) preview([media], media.id);
    else window.open(media.src, '_blank');
}
</script>
