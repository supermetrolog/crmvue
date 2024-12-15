import axios from 'axios';
import dayjs from 'dayjs';
import { responseToData } from '@/api/helpers/responseToData.js';
import {
    responseToPaginatedData,
    responseToPagination
} from '@/api/helpers/responseToPaginatedData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/tasks';

export default {
    async createFromMessage(messageID, options) {
        const url = `/chat-member-messages/create-task/${messageID}`;
        const response = await axios.post(url, options);
        return responseToData(response);
    },
    async create(options, config = { many: false }) {
        const url = config.many ? '/tasks/for-users' : URL;

        const response = await axios.post(url, {
            ...options,
            end: dayjs(options.end).format('YYYY-MM-DD HH:mm:ss'),
            start: dayjs().format('YYYY-MM-DD HH:mm:ss')
        });

        return responseToData(response);
    },
    async get(params) {
        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async getOne(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async delete(taskID) {
        const response = await axios.delete(`${URL}/${taskID}`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async update(taskId, payload) {
        const response = await axios.put(`${URL}/${taskId}`, {
            ...payload,
            end: dayjs(payload.end).format('YYYY-MM-DD HH:mm:ss')
        });
        return responseToData(response);
    },
    async changeStatus(taskId, status, payload = {}) {
        const response = await axios.post(`${URL}/change-status/${taskId}`, {
            status,
            ...payload
        });
        return responseToData(response);
    },
    async createComment(id, payload) {
        const response = await axios.post(`${URL}/${id}/comments`, payload);
        return responseToData(response);
    },
    async loadComments(id, lastCommentId) {
        const response = await axios.get(`/task-comments`, {
            params: {
                task_id: id,
                id_less_then: lastCommentId
            }
        });
        return responseToData(response);
    },
    async getCount(params) {
        const response = await axios.get(URL, { params });
        return responseToPagination(response)?.totalCount;
    },
    async getCounts(params) {
        const response = await axios.get(`${URL}/counts`, { params });
        return responseToData(response);
    },
    async getRelationCounts(params) {
        const response = await axios.get(`${URL}/relations`, { params });
        return responseToData(response);
    },
    async getStatistics(params) {
        const response = await axios.get(`${URL}/statistic`, { params });
        const data = responseToData(response);

        if (data?.length) return data[0];
        return null;
    },
    async getComments(taskID) {
        const response = await axios.get(`${URL}/${taskID}/comments`);
        return responseToData(response);
    },
    async read(taskID) {
        const response = await axios.post(`${URL}/${taskID}/read`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async assign(taskId, payload) {
        const response = await axios.post(`${URL}/${taskId}/assign`, payload);
        return responseToData(response, STATUS_SUCCESS);
    },
    async history(taskId) {
        const response = await axios.get(`${URL}/${taskId}/history`);
        return responseToData(response);
    },
    async restore(id) {
        const response = await axios.patch(`${URL}/${id}/restore`);
        return responseToData(response);
    }
};
