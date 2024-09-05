import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';
import { removeUserInLocalStorage, setUserInLocalStorage } from '@/utils/localStorage.js';

const URL = '/users';

function payloadToData(payload) {
    if (payload.userProfile.fileList?.length) {
        const files = payload.userProfile.fileList;
        delete payload.userProfile.fileList;

        return { files, data: JSON.stringify(payload) };
    }
    return { data: JSON.stringify(payload) };
}

export default {
    auth: {
        async login(payload) {
            try {
                const response = await axios.post(URL + '/login', payload, {
                    params: { expand: 'userProfile' }
                });
                if (response) {
                    const user = SuccessHandler.getData(response);
                    setUserInLocalStorage(user.user, user.access_token);
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
    async list() {
        try {
            const response = await axios.get(URL, {
                params: { expand: 'userProfile.phones,userProfile.emails' }
            });
            if (response) return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
        }

        return null;
    },
    async get(id) {
        try {
            const response = await axios.get(`${URL}/${id}`, {
                params: { expand: 'userProfile.phones,userProfile.emails' }
            });
            if (response) return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
        }

        return null;
    },
    async create(payload) {
        try {
            const response = await axios.postForm(URL, payloadToData(payload));
            if (response) return SuccessHandler.getData(response);
        } catch (e) {
            await setRequestError(e);
        }

        return null;
    },
    async update(id, payload) {
        try {
            const response = await axios.patchForm(`${URL}/${id}`, payloadToData(payload));
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
