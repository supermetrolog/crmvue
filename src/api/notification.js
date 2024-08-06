import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

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
    }
};
