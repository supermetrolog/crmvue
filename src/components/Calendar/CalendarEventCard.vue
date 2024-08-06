<template>
    <DashboardCard class="calendar-event-card">
        <div class="calendar-event-card__header">
            <DashboardChip :style="{ backgroundColor: event.background, color: event.color }">
                #{{ event.id }}
            </DashboardChip>
            <DashboardChip class="dashboard-bg-light">
                {{ startDate }}
            </DashboardChip>
            <DashboardChip class="dashboard-bg-light">
                {{ event.allDay ? 'Весь день' : `${startTime} - ${endTime}` }}
            </DashboardChip>
            <DashboardChip class="dashboard-bg-light">
                {{ event.category }}
            </DashboardChip>
        </div>
        <div class="calendar-event-card__user">
            <Avatar :src="null" size="25" />
            <span class="calendar-event-card__title">{{ event.title }}</span>
        </div>
        <p class="calendar-event-card__content">
            {{ event.content }}
        </p>
    </DashboardCard>
</template>
<script>
import Avatar from '@/components/common/Avatar.vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
dayjs.extend(objectSupport);

export default {
    name: 'CalendarEventCard',
    components: { DashboardCard, DashboardChip, Avatar },
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    computed: {
        startTime() {
            return dayjs(this.event.start).format('HH:mm');
        },
        endTime() {
            return dayjs(this.event.end).format('HH:mm');
        },
        startDate() {
            return dayjs(this.event.start).format('DD.MM.YY');
        }
    }
};
</script>
