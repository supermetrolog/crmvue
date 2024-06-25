<template>
    <div class="calendar">
        <VueCal
            ref="vuecal"
            v-bind="options"
            v-model:selected-date="selectedDate"
            v-model:active-view="activeView"
            @event-drag-create="createEvent"
            @event-duration-change="onEventDurationChange"
            @event-drop="onEventDrop"
            class="vuecal--green-theme"
            :events="events"
            :on-event-click="onEventClick"
            :on-event-create="onEventCreate"
        >
            >
            <template #today-button>
                <HoverActionsButton
                    v-tippy="'Перейти на сегодня'"
                    class="dashboard-bg-success text-white"
                >
                    <i class="fa-solid fa-calendar-day" />
                </HoverActionsButton>
            </template>
            <template #event="{ event, view }">
                <CalendarEvent :event="event" :view="view" />
            </template>
        </VueCal>
        <teleport to="body">
            <CalendarModalEvent v-if="modalIsVisible" @close="closeModal" :event="selectedEvent" />
            <FormModalCalendarEvent />
        </teleport>
    </div>
</template>
<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import CalendarModalEvent from '@/components/Calendar/CalendarModalEvent.vue';
import FormModalCalendarEvent from '@/components/Forms/FormModalCalendarEvent.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import CalendarEvent from '@/components/Calendar/CalendarEvent.vue';

export default {
    name: 'Calendar',
    components: {
        CalendarEvent,
        FormModalCalendarEvent,
        CalendarModalEvent,
        HoverActionsButton,
        VueCal
    },
    emits: ['event-created', 'update-event'],
    props: {
        events: {
            type: Array,
            default: () => []
        }
    },
    setup() {
        const { show } = useAsyncPopup('calendarEventCreator');
        return { openEventCreator: show };
    },
    data() {
        return {
            selectedDate: new Date(),
            activeView: 'week',
            options: {
                locale: 'ru',
                timeFrom: 480,
                timeTo: 1200,
                timeStep: 30,
                todayButton: true,
                eventsCountOnYearView: true,
                eventsOnMonthView: 'short',
                editableEvents: {
                    title: false,
                    drag: true,
                    resize: true,
                    delete: true,
                    create: true
                },
                snapToTime: 10,
                showAllDayEvents: 'short'
            },
            modalIsVisible: false,
            createModalIsVisible: false,
            selectedEvent: null,
            creatingEvent: null,
            deleteEventFunction: () => {}
        };
    },
    methods: {
        onEventClick(event, e) {
            this.selectedEvent = event;
            this.modalIsVisible = true;
            e.stopPropagation();
        },
        closeModal() {
            this.modalIsVisible = false;
            this.selectedEvent = null;
        },
        async createEvent() {
            const createdEvent = await this.openEventCreator(this.creatingEvent);
            if (createdEvent) this.$emit('event-created', createdEvent);
            this.deleteEventFunction();
            this.creatingEvent = {};
        },
        onEventCreate(event, deleteEvent) {
            this.creatingEvent = event;
            this.deleteEventFunction = deleteEvent;
            return event;
        },
        onEventDurationChange({ event }) {
            this.$emit('update-event', event);
        },
        onEventDrop({ event }) {
            this.$emit('update-event', event);
        },
        showWeek(date) {
            this.activeView = 'week';
            this.selectedDate = date;
        }
    }
};
</script>
