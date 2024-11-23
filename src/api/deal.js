import axios from 'axios';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/deals';

export default {
    async list(params) {
        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.patch(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async delete(id, payload) {
        const response = await axios.delete(`${URL}/${id}`, payload);
        return responseToData(response);
    }
};
