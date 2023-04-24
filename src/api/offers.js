import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async search(query) {
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
    async searchCount(query) {
        console.warn("SEARCH OFFERS COUNT");
        query = new URLSearchParams(query).toString();
        let url = "oldDb/objects/offers-count?" + query;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async searchMap(query) {
        console.warn("SEARCH OFFERS");
        query = new URLSearchParams(query).toString();
        let url = "oldDb/objects/offers-map?" + query;
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

    async searchMapCount(query) {
        console.warn("SEARCH OFFERS COUNT");
        query = new URLSearchParams(query).toString();
        let url = "oldDb/objects/offers-map-count?" + query;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async searchFavoriteOffers(query) {
        query = new URLSearchParams(query).toString();
        let url = "favorite-offers?" + query;
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
    async createFavoriteOffer(postData) {
        let url = "favorite-offers";
        let data = false;
        await axios
            .post(url, postData)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async deleteFavoriteOffer(id) {
        let url = "favorite-offers/" + id;
        let data = false;
        await axios
            .delete(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    }
}