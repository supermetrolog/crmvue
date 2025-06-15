import { ref, shallowRef } from 'vue';
import dayjs from 'dayjs';
import api from '@/api/api.js';
import { taskOptions } from '@/const/options/task.options.js';
import { useAuth } from '@/composables/useAuth.js';
import { deduplicate } from '@/utils/deduplicate.js';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';

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
                calls: [{ title: task.title, id: task.id }]
            }
        ]
    };
}

// TODO: idb cache

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
                type: 'scheduled_call',
                user_id: currentUserId.value,
                start_after: from.toJSON(),
                start_before: to.toJSON(),
                status: [taskOptions.clearStatusTypes.NEW]
            });
        });

        for (let task of response.data) {
            const date = dayjsFromMoscow(task.start).format('YY-MM-DD');
            const existing = eventsMap.get(date);

            if (existing) {
                existing.tooltip[0].calls.push({ title: task.title, id: task.id });
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
