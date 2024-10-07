import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';
import { removeUserInLocalStorage, setUserInLocalStorage } from '@/utils/localStorage.js';

const URL = '/users';

export default {
    auth: {
        async login(payload) {
            try {
                const response = await axios.post(URL + '/login', payload);
                if (response) {
                    const user = SuccessHandler.getData(response);
                    setUserInLocalStorage(user.user, user.access_token, user.access_token_id);
                    return user;
                }
            } catch (e) {
                await setRequestError(e);
            }

            return false;
        },
        async logout() {
            try {
                const response = await axios.post(URL + '/logout');
                if (response) {
                    removeUserInLocalStorage();
                    return SuccessHandler.getData(response);
                }
            } catch (e) {
                await setRequestError(e);
            }

            return null;
        }
    },
    sessions: {
        async list(id) {
            try {
                const response = await axios.get(`${URL}/${id}/sessions`);
                if (response) return SuccessHandler.getData(response);
            } catch (e) {
                await setRequestError(e);
            }

            return null;
        },
        async drop(id) {
            try {
                const response = await axios.delete(`${URL}/${id}/sessions`);
                if (response) return SuccessHandler.getData(response);
            } catch (e) {
                await setRequestError(e);
            }

            return null;
        }
    },
    async list(params) {
        try {
            const response = await axios.get(URL, {
                params
            });
            if (response) return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
        }

        return null;
    },
    async get(id) {
        try {
            const response = await axios.get(`${URL}/${id}`);
            if (response) return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
        }

        return null;
    },
    async create(payload) {
        try {
            const response = await axios.postForm(URL, payload);
            if (response) return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
        }

        return null;
    },
    async update(id, payload) {
        try {
            const response = await axios.patchForm(`${URL}/${id}`, payload);
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
