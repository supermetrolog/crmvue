import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.ts';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/fields';

export default {
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async list(page = 1) {
        const response = await axios.get(URL, { params: { page } });
        return responseToPaginatedData(response);
    },
    async search(params) {
        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    }
};
