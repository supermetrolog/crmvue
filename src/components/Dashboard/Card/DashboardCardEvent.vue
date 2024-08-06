<template>
    <div class="dashboard-card-event">
        <span class="dashboard-card-event__date">
            {{ notifyAt.day }}
        </span>
        <Avatar
            v-tippy="event.user.userProfile.medium_name"
            :src="event.user.userProfile.avatar"
            :size="50"
        />
        <p class="dashboard-card-event__body">{{ event.message }}</p>
        <DashboardChip class="dashboard-card-event__time">
            {{ notifyAt.time }}
        </DashboardChip>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import Avatar from '@/components/common/Avatar.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

export default {
    name: 'DashboardCardEvent',
    components: { DashboardChip, Avatar },
    props: {
        event: {
            type: Object,
            required: true
        },
        withUser: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        notifyAt() {
            const notifyAt = dayjs(this.event.notify_at + 'Z');

            return {
                day: notifyAt.format('DD'),
                time: notifyAt.format('HH:mm')
            };
        }
    }
};
</script>
