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
    const result = await this.search({
      complex_id: complexId,
    });
    return result;
  },
};
