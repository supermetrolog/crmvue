import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/questions';

export default {
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async createAnswerOption(payload) {
        const response = await axios.post('/question-answers', payload);
        return responseToData(response);
    },
    async updateAnswerOption(id, payload) {
        const response = await axios.patch('/question-answers/' + id, payload);
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async getWithAnswers() {
        const response = await axios.get(`${URL}/with-question-answer`);
        return responseToPaginatedData(response);
    },
    async getAnswers(page = 1) {
        const response = await axios.get('/question-answers', { params: { page } });
        return responseToPaginatedData(response);
    },
    async list() {
        const response = await axios.get(URL);
        return responseToPaginatedData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async deleteAnswer(id) {
        const response = await axios.delete(`/question-answers/${id}`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    }
};
