import api from '@//api/api';

const Task = {
    namespaced: true,
    state: {
        tags: []
    },
    mutations: {
        setTags(state, value) {
            state.tags = value;
        }
    },
    actions: {
        async fetchTags({ commit }) {
            const response = await api.taskTag.list();
            if (response) commit('setTags', response);
        }
    },
    getters: {
        tagsOptions(state) {
            return state.tags.map(tag => ({ label: tag.name, value: tag.id, color: tag.color }));
        }
    }
};

export default Task;
