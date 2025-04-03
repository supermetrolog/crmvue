import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/users';

export default {
    auth: {
        async login(payload) {
            const response = await axios.post(URL + '/login', payload);
            return responseToData(response);
        },
        async logout() {
            const response = await axios.post(URL + '/logout');
            return responseToData(response);
        }
    },
    sessions: {
        async list(id) {
            const response = await axios.get(`${URL}/${id}/sessions`);
            return responseToData(response);
        },
        async drop(id) {
            const response = await axios.delete(`${URL}/${id}/sessions`);
            return responseToData(response);
        }
    },
    async list(params) {
        const response = await axios.get(URL, {
            params
        });
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async create(payload) {
        const response = await axios.postForm(URL, payload);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.patchForm(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    },
    async archive(id) {
        const response = await axios.post(`${URL}/${id}/archive`);
        return responseToData(response);
    },
    async restore(id) {
        const response = await axios.post(`${URL}/${id}/restore`);
        return responseToData(response);
    },
    async activity(payload) {
        const response = await axios.post(`${URL}/activity`, payload);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async online() {
        const response = await axios.get(`${URL}/online`);
        return responseToData(response);
    }
};
