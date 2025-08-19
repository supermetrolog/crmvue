import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';

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
    async sendOffer(payload) {
        const response = await axios.post(`${URL}/send`, payload);
        return responseToData(response);
    },
    async send(payload) {
        const response = await axios.post(`${URL}/send-custom-letter`, payload);
        return responseToData(response);
    },
    async createContactAnswer(payload) {
        const response = await axios.post(`letter-contact-answers`, payload);
        return responseToData(response);
    }
};
