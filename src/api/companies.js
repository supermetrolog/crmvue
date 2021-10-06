import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async getCompanies() {
        const url = "companies?expand=contacts.emails,contacts.phones,contacts.contactComments,broker,companyGroup,consultant,productRanges,categories";
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async getCompany(id) {
        const url = "companies/" + id + "?expand=contacts.emails,contacts.phones,contacts.websites,contacts.contactComments,broker,companyGroup,consultant,categories,productRanges";
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async createCompany(formdata) {
        const url = "companies";
        let data = false;
        await axios
            .post(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async updateCompany(formdata) {
        const url = `companies/${formdata.id}`;
        let data = false;
        await axios
            .patch(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
}