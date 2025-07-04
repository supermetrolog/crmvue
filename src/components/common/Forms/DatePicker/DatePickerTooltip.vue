<template>
    <div class="d-flex flex-column gap-1 schedule-tooltip">
        <p class="font-weight-semi mb-2">{{ label }}</p>
        <div class="schedule-tooltip__list">
            <template v-for="(events, key) in tooltip.events" :key="key">
                <DatePickerTooltipRow
                    v-for="item in events"
                    :key="item.id"
                    :title="item.title"
                    :time="item.time"
                    :icon="pluralTypeToIcon[key]"
                />
            </template>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { plural } from '@/utils/plural.js';
import DatePickerTooltipRow from '@/components/common/Forms/DatePicker/DatePickerTooltipRow.vue';
import { TaskTypeEnum } from '@/types/task';

const props = defineProps({
    tooltip: {
        type: Object,
        required: true
    }
});

const pluralTypeToLabel = {
    [TaskTypeEnum.SCHEDULED_CALL]: ['%d звонок', '%d звонка', '%d звонков'],
    [TaskTypeEnum.SCHEDULED_VISIT]: ['%d встреча', '%d встречи', '%d встреч'],
    [TaskTypeEnum.SCHEDULED_EVENT]: ['%d действие', '%d действия', '%d действий']
};

const pluralTypeToIcon = {
    [TaskTypeEnum.SCHEDULED_CALL]: 'fa-solid fa-phone',
    [TaskTypeEnum.SCHEDULED_VISIT]: 'fa-solid fa-people-arrows',
    [TaskTypeEnum.SCHEDULED_EVENT]: 'fa-solid fa-calendar-check'
};

const label = computed(() => {
    const value = Object.keys(props.tooltip.events)
        .reduce((acc, key) => {
            if (props.tooltip.events[key].length > 0) {
                acc.push(plural(props.tooltip.events[key].length, ...pluralTypeToLabel[key]));
            }

            return acc;
        }, [])
        .join(', ');

    return `Запланировано ${value}`;
});
</script>
