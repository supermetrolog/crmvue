// import axios from "axios"
import api from "@/api/api"
const Timeline = {
    state: {
        timeline: [],
    },
    mutations: {
        updateTimeline(state, data) {
            //Временное решение пока один TImeline
            if (data.length) {
                state.timeline = data[0];
            } else {
                state.timeline = false;
            }
        },
        updateStep(state, data) {
            console.log("UPDATED");
            state.timeline.timelineSteps = state.timeline.timelineSteps.map((step) => {
                if (step.id === data.id) {
                    step = data;
                }
                return step;
            })
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
        }
    },
    getters: {
        TIMELINE(state) {
            return state.timeline
        },
        TIMELINE_REQUEST_ID(state) {
            return state.timeline.request_id
        },
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