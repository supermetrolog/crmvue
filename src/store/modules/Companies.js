import axios from "axios"
const Companies = {
    state: {
        companies: [],
        company: {}
    },
    mutations: {
        updateCompanies(state, data) {
            state.companies = data;
        },
        updateCompany(state, data) {
            state.company = data;
        }
    },
    actions: {
        async FETCH_COMPANIES(context) {
            await axios
                .get("http://crmka/companies?expand=contacts.emails,contacts.phones,contacts.contactComments,broker,companyGroup,consultant")
                .then((Response) => {
                    context.commit('updateCompanies', Response.data)
                });
        },
        async SEARCH_COMPANIES(context, param) {
            let nameEng = "nameEng=" + param.searchText + "&";
            let nameRu = "nameRu=" + param.searchText + "&";
            let officeAdress = "officeAdress=" + param.searchText + "&";
            let legalAddress = "legalAddress=" + param.searchText + "&";
            let contactPhone = "contact.phone=" + param.searchText + "&";
            let searchUrlPart = nameEng + nameRu + officeAdress + legalAddress + contactPhone;
            let url = "http://crmka/companies/search?" + searchUrlPart + "expand=contacts.emails,contacts.phones,contacts.contactComments,broker,companyGroup,consultant";
            await axios
                .get(url)
                .then((Response) => {
                    context.commit('updateCompanies', Response.data)
                });
        },
        async FETCH_COMPANY(context, id) {
            let url = "http://crmka/companies/" + id + "?expand=contacts.emails,contacts.phones,contacts.contactComments,broker,companyGroup,consultant";
            await axios
                .get(url)
                .then((Response) => {
                    context.commit('updateCompany', Response.data)
                });
        },
    },
    getters: {
        COMPANIES(state) {
            return state.companies;
        },
        COMPANY(state) {
            return state.company;
        }
    }
}

export default Companies;