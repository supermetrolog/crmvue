import api from '@/api/api';
import { useQueryHash } from '@/utils/useQueryHash.js';

const Companies = {
    state: {
        companies: [],
        company: null,
        pagination: null,
        companyGroups: [],
        companyGroupList: [],
        companyProductRangeList: [],
        companyInTheBankList: []
    },
    mutations: {
        updateCompanies(state, { data, concat }) {
            state.pagination = data.pagination;
            if (concat) {
                state.companies = state.companies.concat(data.data);
            } else {
                state.companies = data.data;
            }
        },
        updateCompany(state, data) {
            state.company = data;
        },
        updateCompanyGroupList(state, data) {
            let newCompanyGroupList = [];
            data.map(item => {
                newCompanyGroupList.push({
                    value: item.id,
                    label: item.full_name
                });
            });
            state.companyGroupList = newCompanyGroupList;
            state.companyGroups = data;
        },
        updateCompanyProductRangeList(state, data) {
            if (!data.length) {
                data = ['test'];
            }
            state.companyProductRangeList = data;
        },
        updateCompanyInTheBankList(state, data) {
            state.companyInTheBankList = data;
        }
    },
    actions: {
        async FETCH_COMPANIES(context) {
            const companies = await api.companies.getCompanies();
            if (companies) {
                context.commit('updateCompanies', companies);
            }
        },
        async SEARCH_COMPANIES({ commit }, { query, concat = false }) {
            const { setHash, confirmHash } = useQueryHash('companies');
            setHash(query);

            const data = await api.companies.searchCompanies(query);
            if (data) {
                if (confirmHash(query)) commit('updateCompanies', { data, concat });
                else return false;
            }

            return data;
        },
        async FETCH_COMPANY(context, id) {
            const company = await api.companies.getCompany(id);
            if (company) {
                context.commit('updateCompany', company);
            }
        },
        async CREATE_COMPANY(_, formdata) {
            return await api.companies.createCompany(formdata);
        },
        async UPDATE_COMPANY(_, formdata) {
            return await api.companies.updateCompany(formdata);
        },
        async CREATE_COMPANY_GROUPS(_, formdata) {
            return await api.companies.createCompanyGroups(formdata);
        },
        async UPDATE_COMPANY_GROUPS(_, formdata) {
            return await api.companies.updateCompanyGroups(formdata);
        },
        async FETCH_COMPANY_GROUP_LIST(context) {
            if (context.getters.COMPANY_GROUP_LIST.length) return;

            let data = await api.companies.getCompanyGroupList();
            if (data) context.commit('updateCompanyGroupList', data);
        },
        async FETCH_COMPANY_PRODUCT_RANGE_LIST(context) {
            if (context.state.companyProductRangeList.length) return;

            let data = await api.companies.getCompanyProductRangeList();
            if (data) context.commit('updateCompanyProductRangeList', data);
        },
        async FETCH_COMPANY_IN_THE_BANK_LIST(context) {
            if (context.state.companyInTheBankList.length) return;

            let data = await api.companies.getCompanyInTheBankList();
            if (data) context.commit('updateCompanyInTheBankList', data);
        }
    },
    getters: {
        COMPANIES(state) {
            return state.companies;
        },
        COMPANY(state) {
            return state.company;
        },
        COMPANIES_PAGINATION(state) {
            return state.pagination;
        },
        COMPANY_GROUPS(state) {
            return state.companyGroups;
        },
        COMPANY_GROUP_LIST(state) {
            return state.companyGroupList;
        },
        COMPANY_PRODUCT_RANGE_LIST(state) {
            return state.companyProductRangeList;
        },
        COMPANY_IN_THE_BANK_LIST(state) {
            return state.companyInTheBankList;
        }
    }
};

export default Companies;
