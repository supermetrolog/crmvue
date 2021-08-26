// import axios from "axios"
import api from "@/api/api"
const Timeline = {
    state: {
        timeline: []
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
        updateItem(state, newItem) {
            // state.timeline.timelineSteps = state.timeline.timelineSteps.map((branch) => {
            //     branch.map((item) => {
            //         if (item.id === newItem.id) {
            //             item = newItem;
            //         }
            //         return item;
            //     })
            //     return branch;
            // })
            state.timeline.timelineSteps = state.timeline.timelineSteps.map((item) => {
                if (item.id === newItem.id) {
                    item = newItem;
                }
                return item;
            })
        },
        createNewBranch(state, item) {
            state.timeline.push([{
                //      ID нужно получать с сервера (иначе ID будет повторяться чего нельзя допустить!)
                id: 231,
                company_id: item.object_id,
                comment: "ЫЫЫЫЫЫЫЫЫЫЫ",
                step: item.step,
                datetime: "16 фев 15:21",
                isBranch: true
            }]);
        },
        createNewItem(state, param) {
            state.timeline[param.currentBranch].push({
                //      ID нужно получать с сервера (иначе ID будет повторяться чего нельзя допустить!)
                id: 231,
                company_id: param.item.object_id,
                comment: "ЫЫЫЫЫЫЫЫЫЫЫ",
                step: param.item.step + 1,
                datetime: "16 фев 15:21",
                isBranch: true
            })
        }
    },
    actions: {
        async FETCH_TIMELINE(context, request_id) {
            const user = JSON.parse(localStorage.getItem('user')); // Временно
            const timeline = await api.timeline.getTimeline(user.id, request_id);
            context.commit('updateTimeline', timeline)
        },
        async UPDATE_ITEM(context, newItem) {
            context.commit('updateItem', newItem)
        },
        async CREATE_NEW_BRANCH(context, item) {
            context.commit('createNewBranch', item);
        },
        async CREATE_NEW_ITEM(context, param) {
            context.commit('createNewItem', param);
        }
    },
    getters: {
        TIMELINE(state) {
            // console.log(state)
            return state.timeline
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