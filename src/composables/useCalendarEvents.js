import { ref, shallowRef } from 'vue';
import dayjs from 'dayjs';
import api from '@/api/api.js';
import { taskOptions } from '@/const/options/task.options.js';
import { useAuth } from '@/composables/useAuth.js';
import { deduplicate } from '@/utils/deduplicate.js';
import { dayjsFromServer } from '@/utils/formatters/date.ts';
import { TaskTypeEnum } from '@/types/task';
import { isArray } from '@/utils/helpers/array/isArray';

const eventsMap = new Map();

const events = shallowRef([]);

const loadedMonths = new Set();

function isAlreadyLoadedMonth(month) {
    return loadedMonths.has(month.format('YYYY-MM'));
}

function taskToEvent(task) {
    return {
        date: dayjs(task.start).toDate(),
        type: 'dot',
        color: '#7be502',
        tooltip: [
            {
                events: {
                    [task.type]: [
                        {
                            title: task.title,
                            id: task.id,
                            time: dayjsFromServer(task.start).format('HH:mm')
                        }
                    ]
                },
                count: 1
            }
        ]
    };
}

// TODO: idb cache

const TaskEventTypes = [
    TaskTypeEnum.SCHEDULED_EVENT,
    TaskTypeEnum.SCHEDULED_CALL,
    TaskTypeEnum.SCHEDULED_VISIT
];

const TaskEventStatuses = [
    taskOptions.clearStatusTypes.NEW,
    taskOptions.clearStatusTypes.IN_PROGRESS
];

export function useCalendarEvents() {
    const { currentUserId } = useAuth();

    const isLoading = ref(false);

    async function loadEventsAround(date) {
        const dayjsDate = dayjs(date);

        const monthsToLoad = [
            dayjsDate.subtract(1, 'month').startOf('month'),
            dayjsDate.startOf('month'),
            dayjsDate.add(1, 'month').startOf('month'),
            dayjsDate.add(2, 'month').startOf('month')
        ];

        const monthsToFetch = monthsToLoad.filter(month => !isAlreadyLoadedMonth(month));

        if (monthsToFetch.length === 0) return;

        const from = monthsToFetch[0].startOf('month');
        const to = monthsToFetch[monthsToFetch.length - 1].endOf('month');

        isLoading.value = true;

        const key = `calendar:${from.format('YYYY-MM')}-${to.format('YYYY-MM')}`;

        const response = await deduplicate(key, async () => {
            return await api.task.get({
                'per-page': 100,
                types: TaskEventTypes,
                user_id: currentUserId.value,
                start_after: from.toJSON(),
                start_before: to.toJSON(),
                status: TaskEventStatuses
            });
        });

        for (let task of response.data) {
            const date = dayjsFromServer(task.start).format('YY-MM-DD');
            const existing = eventsMap.get(date);

            if (existing) {
                if (!isArray(existing.tooltip[0].events[task.type])) {
                    existing.tooltip[0].events[task.type] = [];
                }

                existing.tooltip[0].events[task.type].push({
                    title: task.title,
                    id: task.id,
                    time: dayjsFromServer(task.start).format('HH:mm')
                });

                existing.tooltip[0].count = (existing.tooltip[0].count ?? 0) + 1;
            } else {
                eventsMap.set(date, taskToEvent(task));
            }
        }

        if (response.data.length) {
            events.value = Array.from(eventsMap.values());
        }

        monthsToFetch.forEach(month => loadedMonths.add(month.format('YYYY-MM')));

        isLoading.value = false;
    }

    return { events, isLoading, loadEventsAround };
}
