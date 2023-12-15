const CallerManager = {
    state: {
        transitionList: []
    },
    mutations: {
        updateTransitionList(state, data) {
            if (state.transitionList.length >= 10) {
                state.transitionList.shift();
            }
            state.transitionList.push(data);
        }
    },
    actions: {
        ADD_TO_TRANSITION_LIST(context, data) {
            context.commit('updateTransitionList', data);
        }
    },
    getters: {
        TRANSITION_LIST(state) {
            return state.transitionList;
        }
    }
};

export default CallerManager;
