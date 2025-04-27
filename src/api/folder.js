import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/folders';

export default {
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async search(params) {
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
    },
    async searchEntities(params) {
        const response = await axios.get(`${URL}/entities`, { params });
        return responseToPaginatedData(response);
    },
    async reorderFolders(payload) {
        const response = await axios.post(`${URL}/reorder`, payload);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async addEntities(folderId, payload) {
        const response = await axios.post(`${URL}/${folderId}/entities`, payload);
        return responseToData(response);
    },
    async removeEntities(folderId, payload) {
        const response = await axios.delete(`${URL}/${folderId}/entities`, { data: payload });
        return responseToData(response);
    },
    async sortFolders() {},
    async sortEntities() {}
};
