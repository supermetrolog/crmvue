import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async search(query) {
        console.warn("SEARCH");
        query = new URLSearchParams(query).toString();
        let url = "oldDb/objects?" + query + "&expand=offerMix,objectFloors";
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
        console.warn("SEARCH OFFERS");
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
}