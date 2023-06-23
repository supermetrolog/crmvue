import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

export default {
  async fetch(id: string, params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `complex/${id}?${query}` : `comples/${id}`;
    try {
      const response = await axios.get(url);
      return {
        data: SuccessHandler.getData(response),
        pagination: SuccessHandler.getPaginationData(response),
      };
    } catch (e) {
      ErrorHandle.setError(e);
    }
  },
  async getComplexWithObjects(complexId: string) {
    return await this.fetch(complexId, {
      expand: "objects",
    });
  },
};
