// import axios from "axios"
import api from '@/api/api';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';

function generateUniqueObjectId(object) {
    return `${object.object_id}-${object.offer_id}`;
}

function generateObjectExcept(timeline, object) {
    return {
        consultant: timeline.consultant.userProfile.medium_name,
        count: object.duplicate_count,
        last_sent: toBeautifulDateFormat(object.created_at, 'D.MM.YY')
    };
}

const Timeline = {
    state: {
        timeline: null,
        request_timelines: [],
        request_timelines_full: [],
        alreadySubmittedObjects: {},
        alreadySubmittedObjectsSet: new Set(),
        alreadyVisitedObjects: {},
        alreadyVisitedObjectsSet: new Set()
    },
    mutations: {
        updateTimeline(state, data) {
            state.timeline = data.timeline;
            state.request_timelines = data.request_timelines;
        },
        addTimeline(state, timeline) {
            state.timeline = timeline;
            state.request_timelines.push(timeline);
        }
    },
    actions: {
        async fetchTimeline({ commit }, data) {
            const timeline = await api.timeline.getByConsultantAndRequest(
                data.consultant_id,
                data.request_id
            );

            commit('updateTimeline', timeline);
        },
        async createTimeline({ commit }, payload) {
            const timeline = await api.timeline.create(payload);
            if (timeline) {
                commit('addTimeline', timeline);
            }
        },
        async fetchRequestTimelinesData({ state }) {
            const data = await Promise.allSettled(
                state.request_timelines
                    .filter(timeline => timeline.consultant_id !== state.timeline.consultant_id)
                    .map(timeline => api.timeline.get(timeline.id))
            );

            state.request_timelines_full = data.map(response => response.value);

            const alreadySubmittedObjectsSet = new Set();
            const alreadyVisitedObjectsSet = new Set();

            const payload = state.request_timelines_full.reduce(
                (acc, timeline) => {
                    if (timeline.steps.length >= 2) {
                        timeline.steps[1].objects.forEach(object => {
                            const objectId = generateUniqueObjectId(object);

                            if (alreadySubmittedObjectsSet.has(objectId)) {
                                acc.submitted[objectId].push(
                                    generateObjectExcept(timeline, object)
                                );
                            } else {
                                alreadySubmittedObjectsSet.add(objectId);
                                acc.submitted[objectId] = [generateObjectExcept(timeline, object)];
                            }
                        });
                    }

                    if (timeline.steps.length >= 4) {
                        timeline.steps[3].objects.forEach(object => {
                            const objectId = generateUniqueObjectId(object);

                            if (alreadyVisitedObjectsSet.has(objectId)) {
                                acc.visited[objectId].push(generateObjectExcept(timeline, object));
                            } else {
                                alreadyVisitedObjectsSet.add(objectId);
                                acc.visited[objectId] = [generateObjectExcept(timeline, object)];
                            }
                        });
                    }

                    return acc;
                },
                { submitted: {}, visited: {} }
            );

            state.alreadySubmittedObjects = payload.submitted;
            state.alreadyVisitedObjects = payload.visited;

            state.alreadySubmittedObjectsSet = alreadySubmittedObjectsSet;
            state.alreadyVisitedObjectsSet = alreadyVisitedObjectsSet;
        }
    },
    getters: {
        TIMELINE(state) {
            return state.timeline;
        }
    }
};

export default Timeline;
/*
   Все делаем без веток
   Отправляем в любое время новые предложения
   Не запрещаем все редактировать
   После отправки новых предложений помечаем все (нужные) этапы, чтобы броке знал что есть необходимость внести новые данные.
    После отправки новых предложений, уведомляем брокера о том что нужно внести новые данные по новым предложения.
*/
