import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/phones';

export default {
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    },
    async disable(id, payload) {
        const response = await axios.post(`${URL}/${id}/disable`, payload);
        return responseToData(response);
    },
    async enable(id) {
        const response = await axios.post(`${URL}/${id}/enable`);
        return responseToData(response);
    },
    async markAsMain(id) {
        const response = await axios.post(`${URL}/${id}/mark-as-main`);
        return responseToData(response);
    }
};
