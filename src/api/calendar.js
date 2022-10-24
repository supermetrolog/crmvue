import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

export default {
    async fetchCalendar(consultant_id, page) {
        const url = `calendars/${consultant_id}?expand=caller,phoneFrom,phoneFrom.contact,phoneTo,phoneTo.contact&per-page=${page * 10}&sort=-created_at`;
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
    async createEvent(formdata) {
        const url = `calendars`;
        let data = false;
        await axios
            .post(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) =>
                ErrorHandle.setError(e))

        return data;
    },
}