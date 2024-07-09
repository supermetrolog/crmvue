import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

export default {
    async getDeals() {
        const url = 'deals';
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async getDeal(id) {
        const url = 'deals/' + id;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async createDeal(formdata) {
        const url = 'deals';
        let data = false;
        await axios
            .post(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async updateDeal(formdata, id) {
        const url = 'deals/' + id;
        let data = false;
        await axios
            .patch(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async deleteDeal(formdata, id) {
        const url = 'deals/' + id;
        let data = false;
        await axios
            .delete(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    }
};
