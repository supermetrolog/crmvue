import axios from 'axios';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.ts';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';

const URL = 'oldDb/objects';

export default {
    async search(params) {
        const response = await axios.get(`${URL}/offers`, { params });
        return responseToPaginatedData(response);
    },
    async searchCount(params) {
        const response = await axios.get(`${URL}/offers-count`, { params });
        return responseToData(response);
    },
    async searchMap(params) {
        const response = await axios.get(`${URL}/offers-map`, { params });
        return responseToPaginatedData(response);
    },
    async searchMapCount(params) {
        const response = await axios.get(`${URL}/offers-map-count`, { params });
        return responseToData(response);
    },
    async searchFavoriteOffers(params) {
        const response = await axios.get('favorite-offers', { params });
        return responseToPaginatedData(response);
    },
    async createFavoriteOffer(payload) {
        const response = await axios.post('favorite-offers', payload);
        return responseToData(response);
    },
    async deleteFavoriteOffer(id) {
        const response = await axios.delete(`favorite-offers/${id}`);
        return responseToData(response);
    },
    async toggleAvitoAd(id) {
        const response = await axios.post(`${URL}/toggle-avito-ad/${id}`);
        return responseHasStatus(response, 200);
    },
    async get(id) {
        const response = await axios.get(`${URL}/offers/${id}`);
        return responseToData(response);
    }
};
