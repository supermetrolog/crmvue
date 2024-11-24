import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/sessions';

export default {
    async list(params) {
        const response = await axios.get(`${URL}`, { params });
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    }
};
