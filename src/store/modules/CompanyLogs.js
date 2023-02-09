import api from "@/api/api";

const CompanyLogs = {
  state: {
    companyLogs: [],
    pagination: -1,
    page: 0,
  },
  mutations: {
    updateCompanyLogs(state, response) {
      state.companyLogs.unshift(...response.data.reverse());
      //  =
      //   state.page === 0
      //     ? response.data.reverse()
      //     : [...response.data.reverse(), ...state.companyLogs];
      state.pagination = response.pagination.pageCount;
      state.page = response.pagination.currentPage;
    },
    // pageUp(state) {
    //   state.page++;
    // },
    addLogComment(state, log) {
      state.companyLogs.push(log);
    },
  },
  actions: {
    async FETCH_COMPANY_LOGS(context, id) {
      if (context.state.page === context.state.pagination) {
        return "complete";
      } else {
        const logs = await api.companyLogs.getCompanyLogs(
          id,
          context.state.page + 1
        );
        context.commit("updateCompanyLogs", logs);
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
    COMPANY_LOGS_PAGE(state) {
      return `${state.pagination} и ${state.page}`;
    },
  },
};

export default CompanyLogs;
