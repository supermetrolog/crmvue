import axios from 'axios';
import ErrorHandle from '@/api/errors/index.js';

const URL = '/surveys';

export default {
    async create(options) {
        try {
            const response = await axios.post(URL, options);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async get(id) {
        try {
            const response = await axios.get(`${URL}/${id}`);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async list() {
        try {
            const response = await axios.get(URL);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async delete(id) {
        try {
            const response = await axios.delete(`${URL}/${id}`);
            return response.status === 200;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async update(id, payload) {
        try {
            const response = await axios.put(`${URL}/${id}`, payload);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    }
};
