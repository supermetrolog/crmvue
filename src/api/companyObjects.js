import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

export default {
    async search(query) {
        query = new URLSearchParams(query).toString();
        let url =
            'oldDb/objects?' +
            query +
            '&expand=offerMix.generalOffersMix,objectFloors,complex.location.highwayRel,deals.company,deals.competitor, deals.consultant.userProfile';
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
    async searchOffers(query) {
        query = new URLSearchParams(query).toString();
        let url = 'oldDb/objects/offers?' + query;
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
    }
};
