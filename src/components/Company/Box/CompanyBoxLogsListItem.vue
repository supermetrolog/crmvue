<template>
    <div class="CompanyLogsItem">
        <div
            class="CompanyLogsItem-date"
            :class="{
                main: date.type,
                noMain: !date.type
            }"
        >
            <p v-if="date.type">{{ date.value }}</p>
        </div>
        <div v-if="!isSameUser" class="CompanyLogsItem-user">
            <i class="text-dark">
                {{ logItem.user || '&#8212;' }}
            </i>
        </div>
        <div class="CompanyLogsItem-message">
            <span class="CompanyLogsItem-message-time">{{ time }}</span>
            <span class="CompanyLogsItem-message-text" v-html="logItem.message"></span>
            <!-- <a class="d-inline text-primary ml-2" :href="'/letters/'">посмотреть</a> -->
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
    name: 'CompanyLogsItem',
    props: {
        logItem: {
            type: Object,
            required: true
        },
        preventLogItem: {
            type: Object
        }
    },
    data() {
        return {};
    },
    computed: {
        date() {
            const result = {
                value: null,
                type: 1
            };

            let date = dayjs(this.logItem.created_at);

            if (this.preventLogItem && date.isSame(dayjs(this.preventLogItem.created_at), 'day')) {
                result.value = date.format('HH:mm');
                result.type = 0;
            } else if (date.isToday()) result.value = 'Сегодня';
            else if (date.isYesterday()) result.value = 'Вчера';
            else result.value = date.format('DD.MM.YYYY');

            return result;
        },
        isSameUser() {
            return this.preventLogItem?.user === this.logItem.user && !this.date.type;
        },
        time() {
            return dayjs(this.logItem.created_at).format('HH:mm');
        }
    }
};
</script>
