import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.ts';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/reminders';

export default {
    async createFromMessage(messageId, payload) {
        const response = await axios.post(
            `/chat-member-messages/create-reminder/${messageId}`,
            payload
        );
        return responseToData(response);
    },
    async create(payload, config = { many: false }) {
        const url = config.many ? `${URL}/for-users` : URL;

        const response = await axios.post(url, payload);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.patch(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async list(params) {
        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async changeStatus(id, status) {
        const response = await axios.post(`${URL}/change-status/${id}`, { status });
        return responseToData(response);
    }
};
