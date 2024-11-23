import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/letters';

export default {
    async get(id) {
        const expand =
            'company,' +
            'user.userProfile,' +
            'letterOffers.offer.object,' +
            'letterWays,' +
            'letterPhones.contact,' +
            'letterEmails.contact';

        const response = await axios.get(`${URL}/${id}`, { params: { expand } });
        return responseToData(response);
    },
    async send(payload) {
        const response = await axios.post(`${URL}/send`, payload);
        return responseToData(response);
    }
};
