import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/task-tags';

export default {
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async list(options) {
        const response = await axios.get(URL, { params: options });
        return responseToData(response);
    },
    async all() {
        const response = await axios.get(`${URL}/all`);
        return responseToData(response);
    },
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
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
