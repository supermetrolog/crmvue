import axios from 'axios';
import { formToPayload } from '@/utils/helpers/forms/formToPayload.js';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.ts';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/equipment';

const params = [
    'name',
    'address',
    'description',
    'company_id',
    'contact_id',
    'consultant_id',
    'category',
    'availability',
    'delivery',
    'deliveryPrice',
    'price',
    'benefit',
    'tax',
    'count',
    'state',
    'status',
    'passive_type',
    'passive_comment',
    'files',
    'photos'
];

export default {
    async create(options) {
        const response = await axios.postForm(URL, options);
        return responseToData(response);
    },
    async list(options) {
        const response = await axios.get(URL, { params: options });
        return responseToPaginatedData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async update(id, payload) {
        const response = await axios.patchForm(`${URL}/${id}`, formToPayload(payload, params));
        return responseToData(response);
    },
    async called(id, payload) {
        const response = await axios.post(`${URL}/${id}/called`, payload);
        return responseToData(response);
    }
};
