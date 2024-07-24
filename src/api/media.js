import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';

export default {
    // async createFromMessage(messageID, options) {
    //     const url = `/chat-member-messages/create-reminder/${messageID}`;
    //
    //     try {
    //         const response = await axios.post(url, options);
    //         return response.data;
    //     } catch (e) {
    //         setRequestError(e);
    //         return null;
    //     }
    // },
    // async create(options, config = { many: false }) {
    //     const url = config.many ? '/reminders/for-users' : '/reminders';
    //     try {
    //         const response = await axios.post(url, options);
    //         return response.data;
    //     } catch (e) {
    //         setRequestError(e);
    //         return null;
    //     }
    // },
    // async getWithOptions(options) {
    //     const params = new URLSearchParams(options).toString();
    //     const url = params ? `/reminders?${params}` : '/reminders';
    //
    //     try {
    //         const response = await axios.get(url);
    //
    //         return {
    //             data: SuccessHandler.getData(response),
    //             pagination: SuccessHandler.getPaginationData(response)
    //         };
    //     } catch (e) {
    //         setRequestError(e);
    //         return null;
    //     }
    // },
    async get(mediaID) {
        try {
            const response = await axios.get('/media/' + mediaID);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async delete(mediaID) {
        try {
            const response = await axios.delete('/media/' + mediaID);
            return response.status === 200;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    }
    // async update(reminderID, payload) {
    //     const url = `/reminders/${reminderID}`;
    //
    //     try {
    //         const response = await axios.put(url, payload);
    //         return response.data;
    //     } catch (e) {
    //         setRequestError(e);
    //         return null;
    //     }
    // }
};
