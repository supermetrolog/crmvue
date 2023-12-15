import axios from 'axios';
import api from '@/api/api.js';

const Calendar = {
    state: {
        events: []
    },
    mutations: {
        updateCalendarEvents(state, events) {
            state.events = events;
        },
        addEvent(state, newEvent) {
            state.events.push(newEvent);
        },
        updateEvent(state, event) {
            state.events.map(item => {
                if (item.id === event.id) {
                    item.startDate = event.startDate;
                    item.endDate = event.endDate;
                    item.title = event.title;
                }
                return item;
            });
        },
        deleteEvent(state, eventId) {
            state.events = state.events.filter(item => item.id != eventId);
        }
    },
    actions: {
        async FETCH_CALENDAR_EVENTS(context) {
            await axios.get('http://localhost:3000/calendar').then(Response => {
                context.commit('updateCalendarEvents', Response.data);
            });
        },
        async ADD_EVENT(context, newEvent) {
            context.commit('addEvent', newEvent);
        },
        async UPDATE_EVENT(context, event) {
            context.commit('updateEvent', event);
        },
        async DELETE_EVENT(context, eventId) {
            context.commit('deleteEvent', eventId);
        },
        async CREATE_CALENDAR_EVENT(_, formdata) {
            return await api.calendar.createEvent(formdata);
        }
    },
    getters: {
        EVENTS(state) {
            return state.events;
        }
    }
};

export default Calendar;
