<template>
    <li class="timeline-logs-comment">
        <div v-if="date.isLabel" class="timeline-logs-comment__date mx-auto mb-2">
            {{ date.value }}
        </div>
        <div class="timeline-logs-comment__item" :class="{ 'ml-auto': !isSystemComment }">
            <div class="d-flex align-items-center gap-2 mb-2">
                <DashboardChip class="dashboard-bg-gray-l">
                    {{ time }}
                </DashboardChip>
                <DashboardChip
                    :class="{
                        'dashboard-bg-success dashboard-cl-white': !isSystemComment,
                        'dashboard-bg-success-l': isSystemComment
                    }"
                >
                    {{ data.title }}
                </DashboardChip>
                <Button
                    v-if="data.letter_id"
                    @click="$emit('view', data.letter_id)"
                    class="ml-auto"
                    small
                >
                    Просмотреть
                </Button>
            </div>
            <div class="timeline-logs-comment__text" v-html="data.comment"></div>
        </div>
    </li>
</template>

<script>
import dayjs from 'dayjs';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Button from '@/components/common/Button.vue';

export default {
    name: 'TimelineCommentsItem',
    components: { Button, DashboardChip },
    emits: ['view'],
    props: {
        data: {
            type: Object
        },
        preventComment: {
            type: Object
        }
    },
    computed: {
        isSystemComment() {
            return !this.data.title || this.data.title.includes('система');
        },
        date() {
            const result = {
                value: null,
                isLabel: true
            };

            let date = dayjs(this.data.created_at);

            if (this.preventComment && date.isSame(dayjs(this.preventComment.created_at), 'day')) {
                result.value = date.format('HH:mm');
                result.isLabel = false;
            } else if (date.isToday()) result.value = 'Сегодня';
            else if (date.isYesterday()) result.value = 'Вчера';
            else result.value = date.format('D.MM.YYYY, HH:mm');

            return result;
        },
        time() {
            return dayjs(this.data.created_at).format('HH:mm');
        }
    }
};
</script>

<style></style>
