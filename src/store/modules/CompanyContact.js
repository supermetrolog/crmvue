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
        createComment(state, comment) {
            const contactIndex = state.companyContacts.findIndex(
                element => element.id === comment.contact_id
            );

            if (contactIndex !== -1)
                state.companyContacts[contactIndex].contactComments.push(comment);
        }
    },
    actions: {
        async DELETE_CONTACT({ commit }, contact) {
            const deleted = await api.contacts.delete(contact.id);
            if (deleted) commit('deleteContact', contact.id);
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

            const newComment = await api.contacts.createComment(payload);

            if (newComment) commit('createComment', newComment);
        }
    },

    getters: {
        COMPANY_CONTACTS(state) {
            return state.companyContacts;
        }
    }
};

export default CompanyContact;
