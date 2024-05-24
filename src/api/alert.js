import axios from 'axios';
import ErrorHandle from '@/api/errors/index.js';
import SuccessHandler from '@/api/success/index.js';

export default {
    async createFromMessage(messageID, options) {
        const url = `/chat-member-messages/create-alert/${messageID}`;

        try {
            const response = await axios.post(url, options);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async create(options, config = { many: false }) {
        const url = config.many ? '/alerts/for-users' : '/alerts';

        try {
            const response = await axios.post(url, options);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async get(options) {
        const params = new URLSearchParams(options).toString();
        const url = params ? `/alerts?${params}` : '/alerts';

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
    async delete(alertID) {
        const url = `/alerts/${alertID}`;

        try {
            const response = await axios.delete(url);

            return response.status === 200;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async update(alertID, payload) {
        const url = `/alerts/${alertID}`;

        try {
            const response = await axios.put(url, payload);

            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    }
    // async getCount(options) {
    //     const params = new URLSearchParams(options).toString();
    //
    //     try {
    //         const response = await axios.get(params ? `/tasks?${params}` : '/tasks');
    //         const pagination = SuccessHandler.getPaginationData(response);
    //
    //         return pagination.totalCount;
    //     } catch (e) {
    //         ErrorHandle.setError(e);
    //         return null;
    //     }
    // }
};
