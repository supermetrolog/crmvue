import axios from 'axios';
import ErrorHandle from '@/api/errors/index.js';
import SuccessHandler from '@/api/success/index.js';

export default {
    async createForChatMember(chatMemberID, options) {
        const url = `/chat-members/${chatMemberID}/called`;

        try {
            const response = await axios.post(url, options);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async create(options) {
        try {
            const response = await axios.post('/calls', options);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async get(options) {
        const params = new URLSearchParams(options).toString();
        const url = params ? `/calls?${params}` : '/calls';

        try {
            const response = await axios.get(url);

            return {
                data: SuccessHandler.getData(response),
                pagination: SuccessHandler.getPaginationData(response)
            };
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async delete(callID) {
        const url = `/calls/${callID}`;

        try {
            const response = await axios.delete(url);
            return response.status === 200;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async update(callID, payload) {
        const url = `/calls/${callID}`;

        try {
            const response = await axios.put(url, payload);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    }
};
