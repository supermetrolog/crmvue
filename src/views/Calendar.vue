<template>
    <div class="calendar-view">
        <div class="row">
            <div class="col-12 mb-2 d-flex align-items-center">
                <h2>Календарь событий</h2>
                <DashboardTargetUser v-model="targetUser" />
            </div>
            <div class="col-12 col-xl-8">
                <Calendar
                    ref="calendar"
                    @event-created="createEvent"
                    @update-event="updateEvent"
                    :events="events"
                />
            </div>
            <div class="col-12 col-xl-4">
                <div class="calendar-view__week">
                    <Button v-tippy="'На неделю назад'" @click="changeWeek(-7)" success small>
                        <i class="fa-solid fa-chevron-left" />
                    </Button>
                    <DashboardChip class="dashboard-bg-success-l">
                        События на {{ currentDate }}
                    </DashboardChip>
                    <Button v-tippy="'На неделю вперед'" @click="changeWeek(7)" success small>
                        <i class="fa-solid fa-chevron-right" />
                    </Button>
                </div>
                <div class="calendar-view__list">
                    <div
                        v-for="block in eventsByWeekday"
                        :key="block.label"
                        class="calendar-view__block"
                    >
                        <DashboardChip class="dashboard-bg-success-l">
                            {{ block.label }}
                        </DashboardChip>
                        <CalendarEventCard
                            v-for="event in block.events"
                            :key="event.id"
                            @click="showEventInCalendar(event)"
                            :event="event"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Calendar from '@/components/Calendar/Calendar.vue';
import DashboardTargetUser from '@/components/Dashboard/DashboardTargetUser.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import Button from '@/components/common/Button.vue';
import CalendarEventCard from '@/components/Calendar/CalendarEventCard.vue';
import { weekdays } from '@/const/const.js';

dayjs.extend(weekday);

export default {
    name: 'CalendarView',
    components: { CalendarEventCard, Button, DashboardChip, DashboardTargetUser, Calendar },
    data() {
        return {
            currentWeekStart: dayjs().weekday(0),
            targetUser: null,
            events: [
                {
                    id: 1,
                    start: new Date().addHours(-3),
                    end: new Date().addHours(2),
                    title: 'Test title',
                    content: 'Test content',
                    class: 'aboba',
                    color: '#ffffff',
                    background: '#6edea6',
                    category: 'Категория'
                },
                {
                    id: 2,
                    start: new Date().addDays(1),
                    end: new Date().addDays(1),
                    title: 'Test title',
                    content: 'Test content',
                    class: 'aboba',
                    color: '#ffffff',
                    background: '#6edea6',
                    allDay: true,
                    category: 'Категория'
                }
            ]
        };
    },
    computed: {
        currentDate() {
            return `${this.currentWeekStart.weekday(0).format('DD MMMM')} - ${this.currentWeekStart.weekday(6).format('DD MMMM')}`;
        },
        eventsByWeekday() {
            const eventsObject = this.events.reduce((acc, event) => {
                const weekday = dayjs(event.start).weekday();

                if (weekday in acc) acc[weekday].push(event);
                else acc[weekday] = [event];

                return acc;
            }, {});

            return Object.keys(eventsObject).map(weekday => ({
                id: weekday,
                label: weekdays[weekday],
                events: eventsObject[weekday]
            }));
        }
    },
    methods: {
        createEvent(event) {
            this.events.push(event);
        },
        updateEvent(event) {
            console.log('Update ' + event._eid);
        },
        changeWeek(diff) {
            this.currentWeekStart = this.currentWeekStart.weekday(diff);
        },
        showEventInCalendar(event) {
            this.$refs.calendar.showWeek(event.start);
        }
    }
};
</script>
