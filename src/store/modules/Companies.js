import api from "@/api/api"

const Companies = {
    state: {
        companies: [],
        company: {},
        companyGroupList: [],
        companyProductRangeList: [],
        companyInTheBankList: [],
        companyActivityProfileList: []
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
        },
        updateCompanyProductRangeList(state, data) {
            state.companyProductRangeList = data;
        },
        updateCompanyInTheBankList(state, data) {
            state.companyInTheBankList = data;
        },
        updateCompanyActivityProfileList(state, data) {
            state.companyActivityProfileList = data;
        }
    },
    actions: {
        async FETCH_COMPANIES(context) {
            const companies = await api.companies.getCompanies();
            if (companies) {
                context.commit('updateCompanies', companies);
            }
        },
        async SEARCH_COMPANIES(context, query, saveState = true) {
            const search = query.searchText;
            const queryParams = {
                nameEng: search,
                nameRu: search,
                officeAdress: search,
                legalAddress: search,
                "contact.phone": search,
            };
            const result = await api.companies.searchCompanies(queryParams);
            if (result && saveState) {
                context.commit('updateCompanies', result);
            }
            return result;
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
                context.commit('updateCompanyGroupList', data);
            }
        },
        async FETCH_COMPANY_PRODUCT_RANGE_LIST(context) {
            let data = await api.companies.getCompanyProductRangeList();
            if (data) {
                context.commit('updateCompanyProductRangeList', data);
            }
        },
        async FETCH_COMPANY_IN_THE_BANK_LIST(context) {
            let data = await api.companies.getCompanyInTheBankList();
            if (data) {
                context.commit('updateCompanyInTheBankList', data);
            }
        },
        async FETCH_COMPANY_ACTIVITY_PROFILE_LIST(context) {
            let data = await api.companies.getCompanyActivityProfileList();
            if (data) {
                context.commit('updateCompanyActivityProfileList', data);
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
        },
        COMPANY_PRODUCT_RANGE_LIST(state) {
            return state.companyProductRangeList;
        },
        COMPANY_IN_THE_BANK_LIST(state) {
            return state.companyInTheBankList;
        },
        COMPANY_ACTIVITY_PROFILE_LIST(state) {
            return state.companyActivityProfileList;
        }
    }
}

export default Companies;