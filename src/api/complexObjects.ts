import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
  async search(params: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const url = "objects?" + query;
    try {
      const response = await axios.get(url);
      const result = {
        data: SuccessHandler.getData(response),
        pagination: SuccessHandler.getPaginationData(response),
      };
      return result;
    } catch (e) {
      ErrorHandle.setError(e);
    }
  },
  async getComplexObjects(complexId: string) {
    const query = new URLSearchParams({
      complex_id: complexId,
    }).toString();
    const url = "objects?" + query;
    try {
      const response = await axios.get(url);
      const result = SuccessHandler.getData(response);
      console.log(result);
      return result;
    } catch (e) {
      ErrorHandle.setError(e);
    }
  },
};
