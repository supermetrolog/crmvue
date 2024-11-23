import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';

const URL = '/notifications';

export default {
    async search(params) {
        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async fetchCount(consultantId) {
        const response = await axios.get(`${URL}/${consultantId}/count`);
        return responseToData(response);
    },
    async viewedNotCount(consultantId) {
        const response = await axios.get(`${URL}/${consultantId}/viewed-not-count`);
        return responseToData(response);
    },
    async viewedAll(consultantId) {
        const response = await axios.get(`${URL}/${consultantId}/viewed-all`);
        return responseToData(response);
    }
};
