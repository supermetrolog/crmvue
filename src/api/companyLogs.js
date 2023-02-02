import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
  async getCompanyLogs(id) {
    const url = `company-events-log?company_id=${id}&expand=user.userProfile`;
    let data = false;
    await axios
      .get(url)
      .then((Response) => {
        data = SuccessHandler.getData(Response);
      })
      .catch((e) => ErrorHandle.setError(e));
    return data;
  },
  async addLogComment(formdata) {
    const url = `company-events-log`;
    let data = false;
    await axios
      .post(url, formdata)
      .then((Response) => {
        data = SuccessHandler.getData(Response);
      })
      .catch((e) => ErrorHandle.setError(e));
    return data;
  },
};
