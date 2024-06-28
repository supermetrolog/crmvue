<template>
    <div class="calendar-event" :style="{ backgroundColor: event.background, color: event.color }">
        <div class="calendar-event__header">
            <Avatar :src="null" size="25" />
            <span class="calendar-event__title">{{ event.title }}</span>
        </div>
        <p v-if="hasContent" class="calendar-event__content">
            {{ event.content }}
        </p>
        <p class="calendar-event__time">
            {{ event.allDay ? 'Весь день' : `${startTime} - ${endTime}` }}
        </p>
    </div>
</template>
<script>
import Avatar from '@/components/common/Avatar.vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(objectSupport);

export default {
    name: 'CalendarEvent',
    components: { Avatar },
    props: {
        event: {
            type: Object,
            required: true
        },
        view: {
            type: String,
            required: true
        }
    },
    computed: {
        startTime() {
            return dayjs({
                minute: this.event.startTimeMinutes
            }).format('HH:mm');
        },
        endTime() {
            return dayjs({
                minute: this.event.endTimeMinutes
            }).format('HH:mm');
        },
        hasContent() {
            return this.view === 'week' || this.view === 'day';
        }
    }
};
</script>
