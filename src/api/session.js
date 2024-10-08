import axios from 'axios';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

const URL = '/sessions';

export default {
    async list(params) {
        const response = await axios.get(`${URL}`, { params });
        if (response) return SuccessHandler.getData(response);
        return null;
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        if (response) return SuccessHandler.getData(response);
        return null;
    }
};
