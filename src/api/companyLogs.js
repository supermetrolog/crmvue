import axios from 'axios';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseToData } from '@/api/helpers/responseToData.ts';

const URL = '/company-events-log';

export default {
    async listByCompanyId(companyId, page = 1) {
        const params = {
            company_id: companyId,
            page,
            expand: 'user.userProfile'
        };

        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async create(payload) {
        const response = await axios.post(URL, payload);
        return responseToData(response);
    }
};
