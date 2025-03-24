import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/contact-comments';

export default {
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    }
};
