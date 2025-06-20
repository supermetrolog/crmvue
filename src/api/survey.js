import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/surveys';

export default {
    async create(options) {
        const response = await axios.postForm(URL, options);
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}/with-questions`);
        return responseToData(response);
    },
    async findDraftByChatMemberId(chatMemberId) {
        const response = await axios.get(`${URL}/draft-by-chat-member/${chatMemberId}`);
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
        const response = await axios.putForm(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async updateWithAnswers(id, payload) {
        const response = await axios.putForm(`${URL}/${id}/with-survey-question-answer`, payload);
        return responseToData(response);
    },
    async complete(id) {
        const response = await axios.post(`${URL}/${id}/complete`);
        return responseToData(response);
    },
    async cancel(id) {
        const response = await axios.post(`${URL}/${id}/cancel`);
        return responseToData(response);
    }
};
