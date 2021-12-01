import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

export default {
    async fetchCalls(consultant_id, page) {
        const url = `calllists/${consultant_id}?per-page=${page * 10}&sort=-created_at`;
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
    async viewed(consultant_id) {
        const url = `calllists/${consultant_id}/viewed`;
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