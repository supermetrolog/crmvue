import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = 'companies';

export default {
    async search(params) {
        const response = await axios.get(URL, { params });
        return responseToData(response);
    },
    async getCompany(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async create(payload) {
        const response = await axios.postForm(URL, payload);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.putForm(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async getCompanyProductRangeList() {
        const response = await axios.get(`${URL}/product-range-list`);
        return responseToData(response);
    },
    async getCompanyInTheBankList() {
        const response = await axios.get(`${URL}/in-the-bank-list`);
        return responseToData(response);
    },
    async searchCompanies(query) {
        const expand = 'objects.offerMix.generalOfferMix,objects.objectFloors,objects.offers';

        const response = await axios.get(URL, { params: { expand, ...query } });
        return responseToPaginatedData(response);
    },
    async getCompanyGroupList() {
        const response = await axios.get('companygroups');
        return responseToData(response);
    },
    async createCompanyGroups(payload) {
        const response = await axios.post('companygroups', payload);
        return responseToData(response);
    },
    async updateCompanyGroups(payload) {
        const response = await axios.patch(`companygroups/${payload.id}`, payload);
        return responseToData(response);
    },
    async updateLogo(companyId, logo) {
        const response = await axios.postForm(`${URL}/${companyId}/logo`, { logo });
        return responseToData(response);
    },
    async deleteLogo(companyId) {
        const response = await axios.delete(`${URL}/${companyId}/logo`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async enable(companyId) {
        const response = await axios.post(`${URL}/${companyId}/enable`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async disable(companyId, payload) {
        const response = await axios.post(`${URL}/${companyId}/disable`, payload);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async pinMessage(id, payload) {
        const response = await axios.post(`${URL}/${id}/pin-message`, payload);
        return responseToData(response);
    },
    async unpinMessage(id) {
        const response = await axios.delete(`entity-pinned-messages/${id}`);
        return responseHasStatus(response);
    }
};
