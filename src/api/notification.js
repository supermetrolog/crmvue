import axios from 'axios';
import ErrorHandle from '@/api/errors/index.js';
import SuccessHandler from '@/api/success/index.js';

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
            ErrorHandle.setError(e);
            return null;
        }
    }
};
