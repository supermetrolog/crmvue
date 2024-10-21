import axios from 'axios';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = 'oldDb/objects';

export default {
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async update(id, payload) {
        const response = await axios.put(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async list(params) {
        const expand = 'offerMix.offer';
        const response = await axios.get(URL, { params: { expand, ...params } });
        return responseToPaginatedData(response);
    }
};
