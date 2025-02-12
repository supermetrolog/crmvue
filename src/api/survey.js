import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/surveys';

export default {
    async create(options) {
        const response = await axios.post(URL + '/with-survey-question-answer', options);
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}/with-questions`);
        return responseToData(response);
    },
    async list(params) {
        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseHasStatus(response.status, STATUS_SUCCESS);
    },
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async updateWithAnswers(id, payload) {
        const response = await axios.put(`${URL}/${id}/with-survey-question-answer`, payload);
        return responseToData(response);
    }
};
