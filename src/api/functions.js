import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';

export default {
    async getConsultantList() {
        const url =
            'users?fields=id,username,status,userProfile,role&expand=userProfile,userProfile.phones,userProfile.emails';

        const response = await axios.get(url);
        return responseToData(response);
    },
    async getCompanyGroupList() {
        const response = await axios.get('companygroups');
        return responseToData(response);
    }
};
