import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';

const URL = '/user-tours';

export default {
    async markAsViewed(payload) {
        const response = await axios.post(`${URL}/viewed`, payload);
        return responseToData(response);
    },
    async status(params) {
        const response = await axios.get(`${URL}/status`, { params });
        return responseToData(response);
    },
    async history(params) {
        const response = await axios.get(`${URL}/history`, { params });
        return responseToPaginatedData(response);
    },
    async reset(id) {
        const response = await axios.post(`${URL}/${id}/reset`);
        return responseToData(response);
    }
};
