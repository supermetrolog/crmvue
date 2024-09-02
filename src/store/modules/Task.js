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
        async getTasks(_, user_id) {
            const additionalQuery = user_id ? { user_id } : {};

            return await Promise.all([
                api.task.get({ status: 1, ...additionalQuery, deleted: 0 }),
                api.task.get({ status: 2, ...additionalQuery, deleted: 0 }),
                api.task.get({ status: 3, ...additionalQuery, deleted: 0 }),
                api.task.get({ status: 4, ...additionalQuery, deleted: 0 })
            ]);
        },
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
