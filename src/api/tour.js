import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';

const URL = '/user-tours';

export default {
    async markAsViewed(payload) {
        const response = await axios.post(`${URL}/viewed`, payload);
        return responseToData(response);
    },
    async status(params) {
        const response = await axios.get(`${URL}/status`, { params });
        return responseToData(response);
    }
};
