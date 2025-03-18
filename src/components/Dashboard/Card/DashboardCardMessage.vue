<template>
    <div class="dashboard-card-message">
        <i
            v-tippy="'Открыть чат'"
            @click="$emit('toChat')"
            class="fa-solid fa-up-right-from-square dashboard-linker dashboard-card-message__icon"
        ></i>
        <Avatar
            v-if="message.from.model_type === 'user'"
            v-tippy="message.from.model.userProfile.medium_name"
            :src="message.from.model.userProfile.avatar"
            :size="35"
        />
        <span
            class="dashboard-card-message__text"
            v-html="message.message?.length ? message.message : fileNames"
        ></span>
        <span class="dashboard-card-message__date">
            {{ createdDate }}
        </span>
    </div>
</template>

<script>
import Avatar from '@/components/common/Avatar.vue';
import { plural } from '@/utils/plural.js';
import dayjs from 'dayjs';

export default {
    name: 'DashboardCardMessage',
    components: { Avatar },
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    computed: {
        fileNames() {
            return `${plural(
                this.message.attachments.length,
                '%d файл',
                '%d файла',
                '%d файлов'
            )}: ${this.message.attachments.map(attachment => attachment.name).join(', ')}`;
        },
        createdDate() {
            const date = dayjs(this.message.created_at);

            if (date.isToday()) return 'Сегодня, ' + date.format('HH:mm');
            if (date.isYesterday()) return 'Вчера, ' + date.format('HH:mm');

            if (date.isSame(Date.now(), 'year')) return date.format('DD.MM, HH:mm');

            return date.format('DD.MM.YYYY, HH:mm');
        }
    }
};
</script>
