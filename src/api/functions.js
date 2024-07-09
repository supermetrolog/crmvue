import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

export default {
    async getConsultantList() {
        const url =
            'users?fields=id,username,status,userProfile,role&expand=userProfile,userProfile.phones,userProfile.emails';
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    //  async searchCompany(query) {
    //      let searchParam = "nameRu";
    //     const url = "companies/search?";
    //     let data = false;
    //     await axios
    //         .get(url)
    //         .then((Response) => {
    //             data = SuccessHandler.getData(Response);
    //         })
    //         .catch((e) => setRequestError(e));
    //     return data;
    // },
    async getCompanyGroupList() {
        const url = 'companygroups';
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    }
};
