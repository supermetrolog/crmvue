import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

const URL = '/questions';

export default {
    async create(options) {
        try {
            const response = await axios.post(URL, options);
            return SuccessHandler.getData(response);
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async createWithAnswer() {},
    async get(id) {
        try {
            const response = await axios.get(`${URL}/${id}`);
            return SuccessHandler.getData(response);
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async getWithAnswers() {
        try {
            const response = await axios.get(`${URL}/with-question-answer`);
            return SuccessHandler.getData(response);
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async list() {
        try {
            const response = await axios.get(URL);
            return SuccessHandler.getData(response);
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
            return SuccessHandler.getData(response);
        } catch (e) {
            setRequestError(e);
            return null;
        }
    }
};
