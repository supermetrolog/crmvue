import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/utilities';

export default {
    async fixLandObjectPurposes(payload) {
        const response = await axios.post(`${URL}/fix-land-object-purposes`, payload);
        return responseToData(response);
    },
    async reassignConsultantsToCompanies(payload) {
        const response = await axios.post(`${URL}/reassign-consultants-to-companies`, payload);
        return responseToData(response);
    }
};
