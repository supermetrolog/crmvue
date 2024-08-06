<template>
    <Modal
        @close="$emit('close')"
        show
        class="calendar-modal-event dashboard-card-view"
        width="1200"
        :title="event.title"
    >
        <div class="row">
            <div class="col-8">
                <DashboardCard class="mb-2">
                    <p class="dashboard-card-view__subtitle">Описание</p>
                    <p class="calendar-modal-event__content">{{ event.content }}</p>
                </DashboardCard>
                <DashboardCard>
                    <div class="row">
                        <div class="col-4">
                            <div class="dashboard-card-view__block">
                                <p class="dashboard-card-view__helper">Продолжительность</p>
                                <p>
                                    {{ startDate }},
                                    {{ event.allDay ? 'Весь день' : `${startTime} - ${endTime}` }}
                                </p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="dashboard-card-view__block">
                                <p class="dashboard-card-view__helper">Создано</p>
                                <p>{{ createdAt }}</p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="dashboard-card-view__block">
                                <p class="dashboard-card-view__helper">Обновлено</p>
                                <p>{{ updatedAt }}</p>
                            </div>
                        </div>
                    </div>
                </DashboardCard>
            </div>
            <div class="col-4">
                <DashboardCard class="mb-2">
                    <p class="dashboard-card-view__subtitle">О событии</p>
                    <div class="calendar-modal-event__params">
                        <DashboardChip v-tippy="'Уникальный ID'" class="dashboard-bg-light">
                            EID: {{ event._eid }}
                        </DashboardChip>
                        <DashboardChip v-tippy="'Категория'" class="dashboard-bg-light">
                            {{ event.category }}
                        </DashboardChip>
                        <DashboardChip
                            :style="{ backgroundColor: event.background, color: event.color }"
                        >
                            Цвет
                        </DashboardChip>
                    </div>
                </DashboardCard>
                <DashboardCard>
                    <p class="dashboard-card-view__subtitle">Исполнитель</p>
                    <div class="calendar-modal-event__user">
                        <Avatar :src="null" size="35" />
                        <span class="calendar-modal-event__username">Шаев А.А</span>
                    </div>
                </DashboardCard>
            </div>
        </div>
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Avatar from '@/components/common/Avatar.vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
dayjs.extend(objectSupport);

export default {
    name: 'CalendarModalEvent',
    components: { Avatar, DashboardCard, DashboardChip, Modal },
    emits: ['close'],
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    computed: {
        createdAt() {
            return dayjs().format('DD.MM.YY, HH:mm');
        },
        updatedAt() {
            return dayjs().format('DD.MM.YY, HH:mm');
        },
        startTime() {
            return dayjs({ minute: this.event.startTimeMinutes }).format('HH:mm');
        },
        endTime() {
            return dayjs({ minute: this.event.endTimeMinutes }).format('HH:mm');
        },
        startDate() {
            return dayjs(this.event.start).format('DD.MM.YY');
        }
    }
};
</script>
