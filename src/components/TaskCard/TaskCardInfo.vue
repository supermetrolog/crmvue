<template>
    <div class="task-card__info">
        <span v-tippy="createdDate" class="task-card__date">
            <i class="fa-regular fa-clock" />
            <span>{{ shorCreatedDate }}</span>
        </span>
        <template v-if="isUpdated">
            <span class="icon mx-1">·</span>
            <span v-tippy="updatedDate" class="task-card__date">
                <i class="fa-solid fa-edit" />
                <span>{{ shortUpdatedDate }}</span>
            </span>
        </template>
        <template v-if="isDeleted">
            <span class="icon mx-1">·</span>
            <span v-tippy="deletedDate" class="task-card__date">
                <i class="fa-solid fa-trash" />
                <span>{{ shortDeletedDate }}</span>
            </span>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const isDeleted = computed(() => props.task.deleted_at !== null);
const isUpdated = computed(() => props.task.updated_at !== props.task.created_at);

const createdDate = computed(
    () => `Создана: ${toDateFormat(props.task.created_at, 'D MMMM YYYY, HH:mm')}`
);
const shorCreatedDate = computed(() => toDateFormat(props.task.created_at, 'D.MM.YY'));

const updatedDate = computed(
    () => `Обновлена: ${toDateFormat(props.task.updated_at, 'D MMMM YYYY, HH:mm')}`
);
const shortUpdatedDate = computed(() => toDateFormat(props.task.updated_at, 'D.MM.YY'));

const deletedDate = computed(
    () => `Удалена: ${toDateFormat(props.task.deleted_at, 'D MMMM YYYY, HH:mm')}`
);
const shortDeletedDate = computed(() => toDateFormat(props.task.deleted_at, 'D.MM.YY'));
</script>
