// import axios from "axios"
import api from "@/api/api"
const Timeline = {
    state: {
        timeline: null,
        timelineList: [],
        timelineComments: []
    },
    mutations: {
        updateTimeline(state, data) {
            state.timeline = data.timeline;
            state.timelineList = data.timelineList;
        },
        updateStep(state, data) {
            console.log("UPDATED");
            state.timeline.timelineSteps = state.timeline.timelineSteps.map((step) => {
                if (step.id === data.id) {
                    step = data;
                }
                return step;
            })
        },
        updateTimelineComments(state, data) {
            state.timelineComments = data;
        }
    },
    actions: {
        async FETCH_TIMELINE(context, data) {
            const timeline = await api.timeline.getTimeline(data.consultant_id, data.request_id);
            context.commit('updateTimeline', timeline)
        },
        async UPDATE_STEP(context, newStep) {
            // context.commit('updateStep', newStep)
            // console.error(newStep);
            return await api.timeline.updateTimelineStep(newStep);
        },
        async CREATE_NEW_BRANCH(context, step) {
            context.commit('createNewBranch', step);
        },
        async CREATE_NEW_STEP(context, param) {
            context.commit('createNewStep', param);
        },
        async FETCH_TIMELINE_COMMENTS(context, timeline_id) {
            const comments = await api.timeline.getTimelineComments(timeline_id);
            context.commit('updateTimelineComments', comments);
        }
    },
    getters: {
        TIMELINE(state) {
            return state.timeline
        },
        TIMELINE_LIST(state) {
            return state.timelineList
        },
        TIMELINE_REQUEST_ID(state) {
            return state.timeline.request_id
        },
        TIMELINE_COMMENTS(state) {
            return state.timelineComments;
        }
    }
}

export default Timeline;
/*
   Все делаем без веток
   Отправляем в любое время новые предложения
   Не запрещаем все редактировать
   После отправки новых предложений помечаем все (нужные) этапы, чтобы броке знал что есть необходимость внести новые данные.
    После отправки новых предложений, уведомляем брокера о том что нужно внести новые данные по новым предложения.
*/