import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

const URL = '/alerts';

export default {
    async createFromMessage(messageID, options) {
        const url = `/chat-member-messages/create-notification/${messageID}`;

        try {
            const response = await axios.post(url, {
                channel: 'web',
                ...options
            });
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async get(id) {
        try {
            const response = await axios.get(`${URL}/${id}`);
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async list(options) {
        try {
            const response = await axios.get(URL, options);
            return {
                data: SuccessHandler.getData(response),
                pagination: SuccessHandler.getPaginationData(response)
            };
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async delete(id) {
        try {
            const response = await axios.delete(`${URL}/${id}`);
            return response.status === 200;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async update(id, payload) {
        try {
            const response = await axios.put(`${URL}/${id}`, payload);
            return response.data;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    }
};
