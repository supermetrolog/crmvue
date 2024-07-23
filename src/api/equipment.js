import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';
import { formToPayload } from '@/utils/index.js';

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
        try {
            const response = await axios.postForm(URL, options);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async list(options) {
        try {
            const response = await axios.get(URL, { params: options });

            return {
                data: SuccessHandler.getData(response),
                pagination: SuccessHandler.getPaginationData(response)
            };
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async get(id) {
        try {
            const response = await axios.get(`${URL}/${id}`);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async delete(id) {
        try {
            const response = await axios.delete(`${URL}/${id}`);
            return response.status === 200;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async update(id, payload) {
        try {
            const response = await axios.patchForm(`${URL}/${id}`, formToPayload(payload, params));
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async called(id, payload) {
        try {
            const response = await axios.post(`${URL}/${id}/called`, payload);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    }
};
