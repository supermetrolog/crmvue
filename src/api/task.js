import axios from 'axios';
import ErrorHandle from '@/api/errors/index.js';
import SuccessHandler from '@/api/success/index.js';
import dayjs from 'dayjs';

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
    async create(options, config = { many: false }) {
        const url = config.many ? '/tasks/for-users' : '/tasks';
        try {
            const response = await axios.post(url, {
                ...options,
                end: dayjs(options.end).format('YYYY-MM-DD HH:mm:ss'),
                start: dayjs().format('YYYY-MM-DD HH:mm:ss')
            });
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async get(options) {
        const params = new URLSearchParams(options).toString();
        const url = params ? `/tasks?${params}` : '/tasks';

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
            const response = await axios.put(url, {
                ...payload,
                end: dayjs(payload.end).format('YYYY-MM-DD HH:mm:ss')
            });

            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async changeStatus(taskID, status) {
        const url = `/tasks/change-status/${taskID}`;

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
            const response = await axios.get(params ? `/tasks?${params}` : '/tasks');
            const pagination = SuccessHandler.getPaginationData(response);

            return pagination.totalCount;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    }
};
