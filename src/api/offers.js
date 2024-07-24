import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

export default {
    async search(query) {
        query = new URLSearchParams(query).toString();
        let url = 'oldDb/objects/offers?' + query;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = {};
                data.data = SuccessHandler.getData(Response);
                data.pagination = SuccessHandler.getPaginationData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async searchCount(query) {
        query = new URLSearchParams(query).toString();
        let url = 'oldDb/objects/offers-count?' + query;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async searchMap(query) {
        query = new URLSearchParams(query).toString();
        let url = 'oldDb/objects/offers-map?' + query;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = {};
                data.data = SuccessHandler.getData(Response);
                data.pagination = SuccessHandler.getPaginationData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },

    async searchMapCount(query) {
        query = new URLSearchParams(query).toString();
        let url = 'oldDb/objects/offers-map-count?' + query;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async searchFavoriteOffers(query) {
        query = new URLSearchParams(query).toString();
        let url = 'favorite-offers?' + query;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = {};
                data.data = SuccessHandler.getData(Response);
                data.pagination = SuccessHandler.getPaginationData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async createFavoriteOffer(postData) {
        let url = 'favorite-offers';
        let data = false;
        await axios
            .post(url, postData)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async deleteFavoriteOffer(id) {
        let url = 'favorite-offers/' + id;
        let data = false;
        await axios
            .delete(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },

    async toggleAvitoAd(id) {
        let url = `oldDb/objects/toggle-avito-ad/${id}`;
        try {
            const res = await axios.post(url, {});
            return res.status;
        } catch (e) {
            setRequestError(e);
        }
    },

    async getOffer(id) {
        let url = 'oldDb/objects/offers/' + id;

        let data = false;

        await axios
            .get(url)
            .then(Response => {
                data = {};
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));

        return data;
    }
};
