import api from "@/api/api";

const CompanyLogs = {
  state: {
    companyLogs: [],
    pagination: -1,
    page: 0,
    totalCount: null,
  },
  mutations: {
    updateCompanyLogs(state, response) {
      state.companyLogs.unshift(...response.data.reverse());
      state.pagination = response.pagination.pageCount;
      state.page = response.pagination.currentPage;
      state.totalCount = response.pagination.totalCount;
    },
    addLogComment(state, log) {
      state.companyLogs.push(log);
    },
  },
  actions: {
    async FETCH_COMPANY_LOGS(context, id) {
      if (
        context.state.page === context.state.pagination ||
        context.state.totalCount === 0
      ) {
        return "complete";
      } else {
        const response = await api.companyLogs.getCompanyLogs(
          id,
          context.state.page + 1
        );
        context.commit("updateCompanyLogs", response);
        return "loaded";
      }
    },
    async POST_COMPANY_LOG(context, formdata) {
      const log = await api.companyLogs.addLogComment(formdata);
      if (log == false) {
        return;
      }
      context.commit("addLogComment", log);
      return log;
    },
  },

  getters: {
    COMPANY_LOGS(state) {
      return state.companyLogs;
    },
    COMPANY_LOGS_COUNT(state) {
      return state.totalCount;
    },
  },
};

export default CompanyLogs;
