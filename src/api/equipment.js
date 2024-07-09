import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import equipments from '@/test-data/equipments.json';

export default {
    async create(options) {
        const url = '/equipments';
        try {
            const response = await axios.post(url, options);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async list(options) {
        // const params = new URLSearchParams(options).toString();
        // const url = params ? `/equipments?${params}` : '/equipments';

        try {
            // const response = await axios.get(url);

            // return {
            //     data: SuccessHandler.getData(response),
            //     pagination: SuccessHandler.getPaginationData(response)
            // };

            return {
                data: equipments,
                pagination: {
                    currentPage: options.page ? options.page : 1,
                    pageCount: 12
                }
            };
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async get(id) {
        const url = `/equipments/${id}`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async delete(id) {
        const url = `/equipments/${id}`;

        try {
            const response = await axios.delete(url);
            return response.status === 200;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    },
    async update(id, payload) {
        const url = `/equipments/${id}`;

        try {
            const response = await axios.put(url, payload);
            return response.data;
        } catch (e) {
            setRequestError(e);
            return null;
        }
    }
};
