<template>
    <UiButton
        :style="{ 'background-color': color }"
        :badge="eventsBadge"
        :color="expiredEvents.length ? 'dark' : 'white'"
        tooltip="Нажмите, чтобы просмотреть задачи."
        class="fs-2 w-100 font-weight-semi"
        small
        center
    >
        {{ label }}
    </UiButton>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import UiButton from '@/components/common/UI/UiButton.vue';

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
});

// events
const expiredEvents = computed(() => {
    const nearestDate = dayjs().subtract(7, 'day').startOf('day');

    return props.tasks.filter(task => {
        const taskDate = dayjsFromMoscow(task.start);

        return taskDate.isBefore(nearestDate);
    });
});

const label = computed(() => {
    if (expiredEvents.value.length) return 'Просрочено действие!';
    return 'Требуется действие!';
});

const color = computed(() => {
    if (expiredEvents.value.length) return '#810303';
    return '#fbe66b';
});

const eventsBadge = computed(() => {
    if (expiredEvents.value.length > 1) return expiredEvents.value.length;
    return undefined;
});
</script>
