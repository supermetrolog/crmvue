import axios from 'axios';
import ErrorHandle from '@/api/errors/index.js';

export default {
    async createFromMessage(messageID, options) {
        const url = `/chat-member-messages/create-task/${messageID}`;

        try {
            const response = await axios.post(url, options);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async delete(taskID) {
        const url = `/tasks/${taskID}`;

        try {
            const response = await axios.delete(url);

            return response.status === 200;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async update(taskID, payload) {
        const url = `/tasks/${taskID}`;

        try {
            const response = await axios.put(url, payload);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    }
};
