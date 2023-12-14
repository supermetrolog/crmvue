import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

export default {
    async search(query) {
        query = new URLSearchParams(query).toString();
        let url =
            "oldDb/objects?" +
            query +
            "&expand=offerMix.generalOffersMix,objectFloors,complex.location.highwayRel,deals.company,deals.competitor, deals.consultant.userProfile";
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = {};
                data.data = SuccessHandler.getData(Response);
                data.pagination = SuccessHandler.getPaginationData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async searchOffers(query) {
        query = new URLSearchParams(query).toString();
        let url = "oldDb/objects/offers?" + query;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = {};
                data.data = SuccessHandler.getData(Response);
                data.pagination = SuccessHandler.getPaginationData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
};
