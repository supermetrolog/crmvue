import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

const URL = '/sessions';

export default {
    async list(params) {
        try {
            const response = await axios.get(`${URL}`, { params });
            if (response) return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
        }

        return null;
    },
    async delete(id) {
        try {
            const response = await axios.delete(`${URL}/${id}`);
            if (response) return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
        }

        return null;
    }
};
