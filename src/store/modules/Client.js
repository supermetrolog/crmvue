import axios from "axios"
const Companies = {
    state: {
        timeline: {}
    },
    mutations: {
        updateTimeline(state, timeline) {
            state.timeline = timeline
        }
    },
    actions: {
        async FETCH_TIMELINE(context) {
            await axios
                .get("http://localhost:3000/timeline")
                .then((Response) => {
                    context.commit('updateTimeline', Response.data)
                });
        }
    },
    getters: {
        TIMELINE(state) {
            // console.log(state)
            return state.timeline
        }
    }
}

export default Companies;