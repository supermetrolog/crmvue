<template>
    <div class="dashboard-card-message">
        <UiTooltipIcon
            @click="$emit('toChat')"
            tooltip="Открыть чат"
            icon="fa-solid fa-up-right-from-square"
            class="dashboard-linker dashboard-card-message__icon"
        />
        <Avatar
            v-if="message.from.model_type === 'user'"
            :label="message.from.model.userProfile.medium_name"
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
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

export default {
    name: 'DashboardCardMessage',
    components: { UiTooltipIcon, Avatar },
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
