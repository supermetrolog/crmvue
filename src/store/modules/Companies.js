import axios from "axios"
import api from "@/api/api"

const Companies = {
    state: {
        companies: [],
        company: {},
        companyGroupList: []
    },
    mutations: {
        updateCompanies(state, data) {
            state.companies = data;
        },
        updateCompany(state, data) {
            state.company = data;
        },
        updateCompanyGroupList(state, data) {
            let newCompanyGroupList = [];
            data.map(item => {
                newCompanyGroupList.push({
                    value: item.id,
                    label: item.nameRu + '-' + item.nameEng,
                })
            });
            state.companyGroupList = newCompanyGroupList;
        }
    },
    actions: {
        async FETCH_COMPANIES(context) {
            const companies = await api.companies.getCompanies();
            if (companies) {
                context.commit('updateCompanies', companies);
            }
        },
        async SEARCH_COMPANIES(context, param) {
            let nameEng = "nameEng=" + param.searchText + "&";
            let nameRu = "nameRu=" + param.searchText + "&";
            let officeAdress = "officeAdress=" + param.searchText + "&";
            let legalAddress = "legalAddress=" + param.searchText + "&";
            let contactPhone = "contact.phone=" + param.searchText + "&";
            let searchUrlPart = nameEng + nameRu + officeAdress + legalAddress + contactPhone;
            let url = "companies/search?" + searchUrlPart + "expand=contacts.emails,contacts.phones,contacts.contactComments,broker,companyGroup,consultant";
            await axios
                .get(url)
                .then((Response) => {
                    context.commit('updateCompanies', Response.data)
                });
        },
        async FETCH_COMPANY(context, id) {
            const company = await api.companies.getCompany(id);
            if (company) {
                context.commit('updateCompany', company);
            }
        },

        async CREATE_COMPANY(context, formdata) {
            return await api.companies.createCompany(formdata);
        },
        async UPDATE_COMPANY(context, formdata) {
            return await api.companies.updateCompany(formdata);
        },

        async FETCH_COMPANY_GROUP_LIST(context) {
            if (context.getters.COMPANY_GROUP_LIST.length) {
                return;
            }
            let data = await api.functions.getCompanyGroupList();
            if (data) {
                console.log(data);
                context.commit('updateCompanyGroupList', data);
            }
        }

    },
    getters: {
        COMPANIES(state) {
            return state.companies;
        },
        COMPANY(state) {
            return state.company;
        },
        COMPANY_GROUP_LIST(state) {
            return state.companyGroupList;
        }
    }
}

export default Companies;