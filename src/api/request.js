import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async getRequests(id) {
        const url = "requests/company-requests/" + id + "?expand=consultant,directions,districts,gateTypes,objectClasses,objectTypes,regions,deal,deal.consultant&sort=-created_at";

        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                console.log(data);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async createRequest(formdata) {
        const url = "requests";
        let data = false;
        await axios
            .post(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async updateRequest(formdata) {
        const url = `requests/${formdata.id}`;
        let data = false;
        await axios
            .patch(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async deleteRequest(request_id) {
        const url = `requests/${request_id}`;
        let data = false;
        await axios
            .delete(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
}