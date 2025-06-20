import api from '@/api/api';

const CompanyContact = {
    state: {
        companyContacts: []
    },
    mutations: {
        updateCompanyContacts(state, data) {
            state.companyContacts = data;
        },
        deleteContact(state, contact_id) {
            state.companyContacts = state.companyContacts.filter(item => item.id != contact_id);
        },
        createComment(state, { comment, contactId }) {
            const contactIndex = state.companyContacts.findIndex(
                element => element.id === contactId
            );

            if (contactIndex !== -1) state.companyContacts[contactIndex].comments.push(comment);
        }
    },
    actions: {
        async DELETE_CONTACT({ commit }, contact) {
            const deleted = await api.contacts.delete(contact.id);
            if (deleted) commit('deleteContact', contact.id);

            return !!deleted;
        },
        async FETCH_COMPANY_CONTACTS(context, company_id) {
            const response = await api.contacts.getByCompany(company_id);
            if (response) {
                context.commit('updateCompanyContacts', response);
            }
            return response;
        },
        async CREATE_CONTACT_COMMENT({ getters, commit }, payload) {
            payload.author_id = getters.THIS_USER.id;

            const comment = await api.contacts.createComment(payload);

            if (comment) commit('createComment', { comment, contactId: payload.contact_id });

            return !!comment;
        }
    },

    getters: {
        COMPANY_CONTACTS(state) {
            return state.companyContacts;
        }
    }
};

export default CompanyContact;
