import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

export default {
    async search(query) {
        query = new URLSearchParams(query).toString();
        const url = `calllists?${query}&expand=caller,phoneFrom.contact.company,phoneTo.contact.company`;
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
        const url = `calllists/${consultant_id}/count`;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async viewedNotCount(consultant_id) {
        const url = `calllists/${consultant_id}/viewed-not-count`;
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
    async viewedAll(consultant_id) {
        const url = `calllists/${consultant_id}/viewed-all`;
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
}