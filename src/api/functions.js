import axios from 'axios';
import ErrorHandle from './errors';
import SuccessHandler from './success';

export default {
    async getConsultantList() {
        const url = 'users?fields=id,username,status,userProfile&expand=userProfile';
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => ErrorHandle.setError(e));
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
    //         .catch((e) => ErrorHandle.setError(e));
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
            .catch(e => ErrorHandle.setError(e));
        return data;
    }
};