import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import {
    responseToPaginatedData,
    responseToPagination
} from '@/api/helpers/responseToPaginatedData.ts';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/tasks';

export default {
    async createFromMessage(messageID, options) {
        const url = `/chat-member-messages/create-task/${messageID}`;
        const response = await axios.postForm(url, options);
        return responseToData(response);
    },
    async create(payload, config = { many: false }) {
        const url = config.many ? '/tasks/for-users' : URL;

        const response = await axios.postForm(url, payload);

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
        const response = await axios.putForm(`${URL}/${taskId}`, payload);
        return responseToData(response);
    },
    async changeStatus(taskId, status, payload = {}) {
        const response = await axios.post(`${URL}/change-status/${taskId}`, {
            status,
            ...payload
        });
        return responseToData(response);
    },
    async changeDates(taskId, payload) {
        const response = await axios.post(`${URL}/${taskId}/change-dates`, payload);
        return responseToData(response);
    },
    async changeType(taskId, payload) {
        const response = await axios.post(`${URL}/${taskId}/change-type`, payload);
        return responseToData(response);
    },
    async createComment(id, payload) {
        const response = await axios.postForm(`${URL}/${id}/comments`, payload);
        return responseToData(response);
    },
    async createRelations(id, relations) {
        const response = await axios.postForm(`${URL}/${id}/relations`, { relations });
        return responseToData(response);
    },
    async getRelations(id) {
        const response = await axios.get(`${URL}/${id}/relations`);
        return responseToData(response);
    },
    async deleteRelation(id) {
        const response = await axios.delete(`/task-relation-entity/${id}`);
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
        const response = await axios.get(`${URL}/relations-statistics`, { params });
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
    async getFiles(taskId) {
        const response = await axios.get(`${URL}/${taskId}/files`);
        return responseToData(response);
    },
    async deleteFiles(taskId, payload) {
        const response = await axios.delete(`${URL}/${taskId}/files`, { data: payload });
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async addFiles(taskId, payload) {
        const response = await axios.postForm(`${URL}/${taskId}/files`, payload);
        return responseToData(response);
    },
    async read(taskID) {
        const response = await axios.post(`${URL}/${taskID}/read`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async assign(taskId, payload) {
        const response = await axios.post(`${URL}/${taskId}/assign`, payload);
        return responseToData(response);
    },
    async history(taskId) {
        const response = await axios.get(`${URL}/${taskId}/history`);
        return responseToData(response);
    },
    async restore(id) {
        const response = await axios.post(`${URL}/${id}/restore`);
        return responseToData(response);
    },
    async postpone(id, payload) {
        const response = await axios.post(`${URL}/${id}/postpone`, payload);
        return responseToData(response);
    }
};
