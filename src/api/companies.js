import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';

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
        const response = await axios.patchForm(`${URL}/${id}`, payload);
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
        const expand =
            'objects.offerMix.generalOfferMix,' +
            'objects.objectFloors,' +
            'requests.timelines.timelineSteps';

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
    }
};
