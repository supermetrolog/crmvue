import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/task-favorites';

export default {
    async list(params) {
        const response = await axios.get(URL, { params });
        return responseToData(response);
    },
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    }
};
