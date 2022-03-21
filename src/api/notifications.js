import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async fetch(consultant_id, page) {
        const url = `notifications/${consultant_id}?per-page=${page * 10}&sort=-created_at`;
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
    async search(query) {
        query = new URLSearchParams(query).toString();
        const url = `notifications?${query}`;
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
    async fetchCount(consultant_id) {
        const url = `notifications/${consultant_id}/count`;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async viewed(consultant_id) {
        const url = `notifications/${consultant_id}/viewed`;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) =>
                ErrorHandle.setError(e))

        return data;
    },
    logout() {
        console.log("logout");
    }
}