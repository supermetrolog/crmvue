import axios from 'axios';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/calendars';

export default {
    async getByConsultantId(consultantId, page = 1) {
        const params = {
            expand: 'caller,phoneFrom,phoneFrom.contact,phoneTo,phoneTo.contact',
            'per-page': page * 10,
            sort: '-created_at'
        };

        const response = await axios.get(`${URL}/${consultantId}`, { params });
        return responseToPaginatedData(response);
    },
    async createEvent(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async updateEvent(id, payload) {
        const response = await axios.patch(`${URL}/${id}`, payload);
        return responseToData(response);
    }
};
