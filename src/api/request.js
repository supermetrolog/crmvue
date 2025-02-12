import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';

const URL = '/requests';

export default {
    async byCompanyId(companyId) {
        const params = {
            expand:
                'company,' +
                'consultant.userProfile,' +
                'contact.emails,' +
                'directions,districts,gateTypes,objectClasses,objectTypes,objectTypesGeneral,' +
                'regions.info,' +
                'deal.company,deal.offer,deal.consultant.userProfile,deal.offer.generalOffersMix,deal.competitor,' +
                'timeline_progress',
            sort: '-created_at'
        };

        const response = await axios.get(`${URL}/company-requests/${companyId}`, { params });
        return responseToData(response);
    },
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async search(query = {}, expand = null) {
        const _expand =
            expand ??
            'regions.info,' +
                'directions,' +
                'districts,' +
                'company,company.contacts_count,company.active_contacts_count,company.objects_count,company.requests_count,' +
                'consultant.userProfile,' +
                'timeline_progress,' +
                'gateTypes,' +
                'objectClasses,objectTypes,objectTypesGeneral,' +
                'contact,contact.emails,contact.phones';

        const stringParams = new URLSearchParams(query).toString();

        const response = await axios.get(`${URL}?${stringParams}&expand=${_expand}`);
        return responseToPaginatedData(response);
    },
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    },
    async update(id, payload) {
        const response = await axios.patch(`${URL}/${id}`, payload);
        return responseToData(response);
    },
    async delete(id) {
        const response = await axios.delete(`${URL}/${id}`);
        return responseToData(response);
    },
    async disable(id, payload) {
        const response = await axios.patch(`${URL}/disable/${id}`, payload);
        return responseToData(response);
    },
    async undisable(id) {
        const response = await axios.patch(`${URL}/undisable/${id}`);
        return responseToData(response);
    }
};
