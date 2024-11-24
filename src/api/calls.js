import axios from 'axios';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/calllists';

export default {
    async search(query) {
        const stringParams = new URLSearchParams(query).toString();

        const expand = 'caller,phoneFrom.contact.company,phoneTo.contact.company';

        const url = `${URL}?expand=${expand}` + (stringParams ? `&${stringParams}` : '');

        const response = await axios.get(url);
        return responseToPaginatedData(response);
    },
    async count(consultantId) {
        const response = await axios.get(`${URL}/${consultantId}/count`);
        return responseToData(response);
    },
    async viewedNotCount(consultantId) {
        const response = await axios.get(`${URL}/${consultantId}/viewed-not-count`);
        return responseToData(response);
    },
    async viewedAll(consultantId) {
        const response = await axios.get(`${URL}/${consultantId}/viewed-all`);
        return responseToData(response);
    }
};
