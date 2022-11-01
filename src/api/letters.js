import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

export default {
  async search(query) {
    query = new URLSearchParams(query).toString();
    const url = `letters?${query}`;
    let data = false;
    await axios
      .get(url)
      .then((Response) => {
        data = {};
        data.data = SuccessHandler.getData(Response);
        data.pagination = SuccessHandler.getPaginationData(Response);
      })
      .catch((e) => ErrorHandle.setError(e));
    return data;
  },
};
