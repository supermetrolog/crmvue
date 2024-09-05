import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';
import dayjs from 'dayjs';

const URL = '/tasks';

export default {
    async createFromMessage(messageID, options) {
        const url = `/chat-member-messages/create-task/${messageID}`;

        try {
            const response = await axios.post(url, options);
            return response.data;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async create(options, config = { many: false }) {
        const url = config.many ? '/tasks/for-users' : URL;
        try {
            const response = await axios.post(url, {
                ...options,
                end: dayjs(options.end).format('YYYY-MM-DD HH:mm:ss'),
                start: dayjs().format('YYYY-MM-DD HH:mm:ss')
            });
            return response.data;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async get(options) {
        try {
            const response = await axios.get(URL, { params: options });

            return {
                data: SuccessHandler.getData(response),
                pagination: SuccessHandler.getPaginationData(response)
            };
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async getOne(id) {
        try {
            const response = await axios.get(`${URL}/${id}`);
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async delete(taskID) {
        try {
            const response = await axios.delete(`${URL}/${taskID}`);

            return response.status === 200;
        } catch (e) {
            await setRequestError(e);
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
            await setRequestError(e);
            return null;
        }
    },
    async changeStatus(taskID, status, payload = {}) {
        try {
            const response = await axios.post(`${URL}/change-status/${taskID}`, {
                status,
                ...payload
            });
            return response.data;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async createComment(id, payload) {
        try {
            const response = await axios.post(`${URL}/${id}/comments`, payload);
            return response.data;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async getCount(params) {
        try {
            const response = await axios.get(URL, { params });
            const pagination = SuccessHandler.getPaginationData(response);

            return pagination.totalCount;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async getCounts(params) {
        try {
            const response = await axios.get(`${URL}/counts`, { params });
            return response.data;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async getRelationCounts(params) {
        try {
            const response = await axios.get(`${URL}/relations`, { params });
            return response.data;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async getStatistics(params) {
        try {
            const response = await axios.get(`${URL}/statistic`, { params });
            return response.data?.length ? response.data[0] : null;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async getComments(taskID) {
        try {
            const response = await axios.get(`${URL}/${taskID}/comments`);
            return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    },
    async read(taskID) {
        try {
            const response = await axios.post(`${URL}/${taskID}/read`);
            return response.status === 200;
        } catch (e) {
            await setRequestError(e);
            return null;
        }
    }
};
