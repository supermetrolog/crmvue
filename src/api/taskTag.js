import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

const URL = '/task-tags';

export default {
    async get(id) {
        try {
            const response = await axios.get(`${URL}/${id}`);
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async list(options) {
        try {
            const response = await axios.get(URL, { params: options });
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async all() {
        try {
            const response = await axios.get(`${URL}/all`);
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async create(payload) {
        try {
            const response = await axios.post(URL, payload);
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async delete(id) {
        try {
            const response = await axios.delete(`${URL}/${id}`);
            return response.status === 200;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async update(id, payload) {
        try {
            const response = await axios.put(`${URL}/${id}`, payload);
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    }
};
