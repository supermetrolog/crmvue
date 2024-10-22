import axios from 'axios';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';

const URL = 'oldDb/objects';

export default {
    async search(params) {
        const expand =
            'offerMix.generalOffersMix,' +
            'objectFloors,' +
            'complex.location.highwayRel,' +
            'deals.company,deals.competitor,deals.consultant.userProfile';

        const response = await axios.get(URL, { params: { ...params, expand } });
        return responseToPaginatedData(response);
    },
    async searchOffers(params) {
        const response = await axios.get(`${URL}/offers`, { params });
        return responseToPaginatedData(response);
    }
};
