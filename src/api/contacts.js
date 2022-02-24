import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async getContacts(company_id) {
        const url = `contacts/company-contacts/${company_id}?expand=contactComments,contactComments.author,contactComments.author.userProfile,emails,phones,websites,consultant,consultant.userProfile,wayOfInformings&sort=-created_at`;
        let data = false;

        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;

    },
    async createContact(formdata) {
        const url = "contacts";
        let data = false;
        await axios
            .post(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async updateContact(formdata) {
        const url = `contacts/${formdata.id}`;
        let data = false;
        await axios
            .patch(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async deleteContact(contact_id) {
        const url = `contacts/${contact_id}`;
        let data = false;
        await axios
            .delete(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async createComment(formdata) {
        const url = "contacts/create-comment?expand=author,author.userProfile";
        let data = false;
        await axios
            .post(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
}