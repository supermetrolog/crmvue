import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';

export default {
    async getConsultantList() {
        const response = await axios.get('users');
        return responseToData(response);
    },
    async getCompanyGroupList() {
        const response = await axios.get('companygroups');
        return responseToData(response);
    }
};
