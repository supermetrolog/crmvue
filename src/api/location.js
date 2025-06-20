import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';

const URL = '/oldDb/locations';

export default {
    async fetchRegionList() {
        const response = await axios.get(`${URL}/region-list`);
        return responseToData(response);
    }
};
