import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';

const URL = '/contacts';

export default {
    async getByCompany(companyId) {
        const expand =
            'contactComments,contactComments.author,contactComments.author.userProfile,' +
            'emails,phones,invalidPhones,websites,wayOfInformings,' +
            'consultant,consultant.userProfile';
        const sort = '-created_at';

        const response = await axios.get(`${URL}/company-contacts/${companyId}`, {
            params: { expand, sort }
        });
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async list(params) {
        const expand = 'emails,phones,websites,wayOfInformings';

        const response = await axios.get(URL, { params: { expand, ...params } });
        return responseToPaginatedData(response);
    },
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    },
    async createComment(payload) {
        const expand = 'author,author.userProfile';

        const response = await axios.post(`${URL}/create-comment`, payload, { params: { expand } });
        return responseToData(response);
    },
    async disable(id, payload) {
        const response = await axios.post(`${URL}/${id}/disable`, payload);
        return responseToData(response);
    },
    async enable(id) {
        const response = await axios.post(`${URL}/${id}/enable`);
        return responseToData(response);
    }
};
