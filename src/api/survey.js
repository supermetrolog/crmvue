import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

const URL = '/surveys';

export default {
    async create(options) {
        try {
            const response = await axios.post(URL + '/with-survey-question-answer', options);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async get(id) {
        try {
            const response = await axios.get(`${URL}/${id}/with-questions`);
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
            const response = await axios.put(`${URL}/${id}`, payload);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    }
};
