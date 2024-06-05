import axios from 'axios';
import ErrorHandle from '@/api/errors/index.js';
import SuccessHandler from '@/api/success/index.js';

export default {
    async createFromMessage(messageID, options) {
        const url = `/chat-member-messages/create-reminder/${messageID}`;

        try {
            const response = await axios.post(url, options);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async create(options, config = { many: false }) {
        const url = config.many ? '/reminders/for-users' : '/reminders';
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
        const url = params ? `/reminders?${params}` : '/reminders';

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
    async delete(reminderID) {
        const url = `/reminders/${reminderID}`;

        try {
            const response = await axios.delete(url);

            return response.status === 200;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async update(reminderID, payload) {
        const url = `/reminders/${reminderID}`;

        try {
            const response = await axios.put(url, payload);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async changeStatus(reminderID, status) {
        const url = `/reminders/change-status/${reminderID}`;

        try {
            const response = await axios.post(url, { status });
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getCount(options) {
        const params = new URLSearchParams(options).toString();

        try {
            const response = await axios.get(params ? `/reminders?${params}` : '/reminders');
            const pagination = SuccessHandler.getPaginationData(response);

            return pagination.totalCount;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getStatistics(options) {
        const params = new URLSearchParams(options).toString();
        const url = params ? `/reminders/statistic?${params}` : '/reminders/statistic';

        try {
            const response = await axios.get(url);
            return response.data?.length ? response.data[0] : null;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    }
};
