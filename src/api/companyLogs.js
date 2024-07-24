import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

export default {
    async getCompanyLogs(id, page) {
        const url = `company-events-log?company_id=${id}&expand=user.userProfile&page=${page}`;
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
    async addLogComment(formdata) {
        const url = `company-events-log`;
        let data = false;
        await axios
            .post(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    }
};
