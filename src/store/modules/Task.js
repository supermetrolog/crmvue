import api from '@//api/api';

const Task = {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        async getTasks(_, user_id) {
            const additionalQuery = user_id ? { user_id } : {};

            return await Promise.all([
                api.task.get({ status: 1, ...additionalQuery, deleted: 0 }),
                api.task.get({ status: 2, ...additionalQuery, deleted: 0 }),
                api.task.get({ status: 3, ...additionalQuery, deleted: 0 }),
                api.task.get({ status: 4, ...additionalQuery, deleted: 0 })
            ]);
        }
    },
    getters: {}
};

export default Task;
