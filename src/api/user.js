import axios from 'axios';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

const URL = '/users';

export default {
    auth: {
        async login(payload) {
            const response = await axios.post(URL + '/login', payload);
            if (response) return SuccessHandler.getData(response);
            return false;
        },
        async logout() {
            const response = await axios.post(URL + '/logout');
            if (response) return SuccessHandler.getData(response);
            return null;
        }
    },
    sessions: {
        async list(id) {
            const response = await axios.get(`${URL}/${id}/sessions`);
            if (response) return SuccessHandler.getData(response);
            return null;
        },
        async drop(id) {
            const response = await axios.delete(`${URL}/${id}/sessions`);
            if (response) return SuccessHandler.getData(response);
            return null;
        }
    },
    async list(params) {
        const response = await axios.get(URL, {
            params
        });
        if (response) return SuccessHandler.getData(response);
        return null;
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        if (response) return SuccessHandler.getData(response);
        return null;
    },
    async create(payload) {
        const response = await axios.postForm(URL, payload);
        if (response) return SuccessHandler.getData(response);
        return null;
    },
    async update(id, payload) {
        const response = await axios.patchForm(`${URL}/${id}`, payload);
        if (response) return SuccessHandler.getData(response);
        return null;
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        if (response) return SuccessHandler.getData(response);
        return null;
    }
};
