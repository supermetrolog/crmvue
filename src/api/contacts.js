import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

export default {
    async getContacts(company_id) {
        const url = `contacts/company-contacts/${company_id}?expand=invalidPhones,contactComments,contactComments.author,contactComments.author.userProfile,emails,phones,websites,consultant,consultant.userProfile,wayOfInformings&sort=-created_at`;
        let data = false;

        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async searchContacts(query) {
        query = new URLSearchParams(query).toString();
        const url = `contacts?${query}&expand=emails,phones,websites,wayOfInformings`;
        let data = false;

        await axios
            .get(url)
            .then(Response => {
                data = {};
                data.data = SuccessHandler.getData(Response);
                data.pagination = SuccessHandler.getPaginationData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async createContact(formdata) {
        const url = 'contacts';
        let data = false;
        await axios
            .post(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async updateContact(formdata) {
        const url = `contacts/${formdata.id}`;
        let data = false;
        await axios
            .patch(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async deleteContact(contact_id) {
        const url = `contacts/${contact_id}`;
        let data = false;
        await axios
            .delete(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async createComment(formdata) {
        const url = 'contacts/create-comment?expand=author,author.userProfile';
        let data = false;
        await axios
            .post(url, formdata)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    }
};
