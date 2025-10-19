import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.ts';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/alerts';

export default {
    async createFromMessage(messageId, params) {
        const response = await axios.post(
            `/chat-member-messages/create-notification/${messageId}`,
            {
                channel: 'web',
                ...params
            }
        );
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
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
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    }
};
