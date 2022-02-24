import api from "@/api/api"

const CompanyContact = {
    state: {
        companyContacts: [],
    },
    mutations: {
        updateCompanyContacts(state, data) {
            state.companyContacts = data;
        },
        deleteContact(state, contact_id) {
            state.companyContacts = state.companyContacts.filter(item => item.id != contact_id);
        },
        createComment(state, newComment) {
            state.companyContacts = state.companyContacts.map(item => {
                if (item.id == newComment.contact_id) {
                    item.contactComments.push(newComment);
                    return item;
                }
                return item;
            })
        }
    },
    actions: {
        async CREATE_CONTACT(context, formdata) {
            return await api.contacts.createContact(formdata);
        },
        async UPDATE_CONTACT(context, formdata) {
            return await api.contacts.updateContact(formdata);
        },
        async DELETE_CONTACT(context, contact) {
            if (await api.contacts.deleteContact(contact.id)) {
                context.commit('deleteContact', contact.id);
            }
        },
        async FETCH_COMPANY_CONTACTS(context, company_id) {
            const response = await api.contacts.getContacts(company_id);
            if (response) {
                context.commit('updateCompanyContacts', response);
            }
            return response;
        },
        async CREATE_CONTACT_COMMENT(context, formdata) {
            formdata.author_id = context.getters.THIS_USER.id;
            const newComment = await api.contacts.createComment(formdata);
            if (newComment) {
                context.commit('createComment', newComment);
            }
        },
    },

    getters: {
        COMPANY_CONTACTS(state) {
            return state.companyContacts;
        }
    }
}

export default CompanyContact;