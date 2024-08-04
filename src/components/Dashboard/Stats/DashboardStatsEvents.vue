<template>
    <DashboardCard class="dashboard-stats-events dashboard-stats-block">
        <template #header>
            <div class="dashboard-stats-block__header">
                <h3 class="dashboard-card__title">Календарь событий</h3>
                <MessengerButton @click="fetchEvents">Обновить</MessengerButton>
            </div>
        </template>
        <div class="row">
            <div class="col-6">
                <Scheduler v-model="date" @changed="onChangeDate" @mode-changed="onModeChanged" />
            </div>
            <div class="col-6">
                <DashboardChip class="dashboard-bg-light mb-3">
                    События {{ formattedDay }}
                </DashboardChip>
                <Spinner v-if="isLoading" />
                <InProgress v-else-if="true" />
                <div v-else-if="events.length && !isMonthMode" class="dashboard-stats-events__list">
                    <DashboardCardEvent
                        v-for="event in events"
                        :key="event.id"
                        :event="event"
                        :with-user="!!user"
                    />
                </div>
                <EmptyLabel v-else>Список событий в этот день пуст..</EmptyLabel>
            </div>
        </div>
    </DashboardCard>
</template>

<script setup>
import api from '@/api/api.js';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Scheduler from '@/components/common/Scheduler.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import Spinner from '@/components/common/Spinner.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import DashboardCardEvent from '@/components/Dashboard/Card/DashboardCardEvent.vue';
import objectSupport from 'dayjs/plugin/objectSupport';
import { computed, onBeforeMount, ref, shallowRef, watch } from 'vue';
import InProgress from '@/components/common/InProgress.vue';

dayjs.extend(objectSupport);

const props = defineProps({
    user: {
        type: Number,
        default: null
    }
});

const { isLoading } = useDelayedLoader();

const events = ref([]);
const date = ref(new Date());
const isMonthMode = shallowRef(false);

const formattedDay = computed(() => dayjs(date.value).format('D MMMM'));

const fetchEvents = async () => {
    isLoading.value = true;

    const userParams = props.user ? { user_id: props.user } : {};
    const response = await api.reminder.get(userParams);

    if (response) {
        events.value = response.data ?? [];
    }

    isLoading.value = false;
};

const onChangeDate = () => {
    fetchEvents();
};

const onModeChanged = mode => {
    isMonthMode.value = mode;
};

watch(() => props.user, fetchEvents);

onBeforeMount(() => {
    fetchEvents();
});
</script>
