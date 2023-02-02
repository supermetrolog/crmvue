import api from "@/api/api";

const CompanyLogs = {
  state: {
    companyLogs: {},
    pagination: null,
  },
  mutations: {
    updateCompanyLogs(state, data) {
      state.companyLogs = data;
    },
  },
  actions: {
    async FETCH_COMPANY_LOGS(context, id) {
      const logs = await api.companyLogs.getCompanyLogs(id);
      context.commit("updateCompanyLogs", logs);
      return logs;
    },
  },

  getters: {
    COMPANY_LOGS(state) {
      return state.companyLogs;
    },
  },
};

export default CompanyLogs;
