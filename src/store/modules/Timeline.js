import axios from "axios"
const Timeline = {
    state: {
        timeline: {}
    },
    mutations: {
        updateTimeline(state, timeline) {
            state.timeline = timeline
        },
        updateItem(state, newItem) {
            state.timeline = state.timeline.map((branch) => {
                branch.map((item) => {
                    if (item.id === newItem.id) {
                        item = newItem;
                    }
                    return item;
                })
                return branch;
            })
        },
        createNewBranch(state, item) {
            state.timeline.push([{
                //      ID нужно получать с сервера (иначе ID будет повторяться чего нельзя допустить!)
                id: 231,
                object_id: item.object_id,
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
                object_id: param.item.object_id,
                comment: "ЫЫЫЫЫЫЫЫЫЫЫ",
                step: param.item.step + 1,
                datetime: "16 фев 15:21",
                isBranch: true
            })
        }
    },
    actions: {
        async FETCH_TIMELINE(context) {
            await axios
                .get("http://localhost:3000/timeline")
                .then((Response) => {
                    context.commit('updateTimeline', Response.data)
                });
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