import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';

const URL = '/task-comments';

export default {
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async list(params) {
        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    }
};
