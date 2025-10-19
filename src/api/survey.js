import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.ts';
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
    async findPendingByChatMemberId(chatMemberId) {
        const response = await axios.get(`${URL}/pending-by-chat-member/${chatMemberId}`);
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
    },
    async delay(id) {
        const response = await axios.post(`${URL}/${id}/delay`);
        return responseToData(response);
    },
    async continue(id) {
        const response = await axios.post(`${URL}/${id}/continue`);
        return responseToData(response);
    },
    async createAction(surveyId, payload) {
        const response = await axios.post(`${URL}/${surveyId}/actions`, payload);
        return responseToData(response);
    },
    async updateAction(id, payload) {
        const response = await axios.put(`survey-actions/${id}`, payload);
        return responseToData(response);
    },
    async statistics(params = {}) {
        const response = await axios.get(`${URL}/statistics`, { params });
        return responseToData(response);
    }
};
