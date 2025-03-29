import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';

const URL = '/requests';

export default {
    async byCompanyId(companyId) {
        const response = await axios.get(`${URL}/company-requests/${companyId}`);
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
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.patch(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    },
    async disable(id, payload) {
        const response = await axios.patch(`${URL}/disable/${id}`, payload);
        return responseToData(response);
    },
    async undisable(id) {
        const response = await axios.patch(`${URL}/undisable/${id}`);
        return responseToData(response);
    },
    async clone(id, payload) {
        const response = await axios.post(`${URL}/${id}/clone`, payload);
        return responseToData(response);
    }
};
