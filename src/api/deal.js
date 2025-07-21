import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';

const URL = '/deals';

export default {
    async list(params) {
        const response = await axios.get(URL, { params });
        // TODO: add pagination
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async createForRequest(requestId, payload) {
        const response = await axios.post(`${URL}/for-request/${requestId}`, payload);
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
