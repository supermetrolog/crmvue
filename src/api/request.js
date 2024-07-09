import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

export default {
    async getRequests(id) {
        const url =
            'requests/company-requests/' +
            id +
            '?expand=contact.emails,company,consultant.userProfile,directions,districts,gateTypes,objectClasses,objectTypes,objectTypesGeneral,regions.info,deal.company,deal.offer,deal.consultant.userProfile,deal.offer.generalOffersMix,deal.competitor,timeline_progress&sort=-created_at';

        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async getRequest(id) {
        const url = 'requests/' + id;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data[0];
    },
    async searchRequests(query, expand = null) {
        expand =
            expand ||
            'regions.info,directions,districts,company,consultant.userProfile,timeline_progress,gateTypes,objectClasses,objectTypes,objectTypesGeneral';
        query = new URLSearchParams(query).toString();
        let url = 'requests?' + query + '&expand=' + expand;
        let data = false;
        await axios.get(url).then(Response => {
            data = {};
            data.data = SuccessHandler.getData(Response);
            data.pagination = SuccessHandler.getPaginationData(Response);
        });
        return data;
    },
    async createRequest(formdata) {
        const url = 'requests';
        let data = false;
        await axios
            .post(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async updateRequest(formdata) {
        const url = `requests/${formdata.id}`;
        let data = false;
        await axios
            .patch(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async deleteRequest(request_id) {
        const url = `requests/${request_id}`;
        let data = false;
        await axios
            .delete(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },

    async disable(request_id, formdata) {
        const url = `requests/disable/${request_id}`;
        let data = false;
        await axios
            .patch(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },

    async undisable(request_id) {
        const url = `requests/undisable/${request_id}`;
        let data = false;
        await axios
            .patch(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    }
};
