import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
  async search(query) {
    console.warn("SEARCH OFFERS");
    query = new URLSearchParams(query).toString();
    let url = "oldDb/objects/offers?" + query;
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

  async searchFavoriteOffers(query) {
    query = new URLSearchParams(query).toString();
    let url = "favorite-offers?" + query;
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
  async createFavoriteOffer(postData) {
    let url = "favorite-offers";
    let data = false;
    await axios
      .post(url, postData)
      .then((Response) => {
        data = SuccessHandler.getData(Response);
      })
      .catch((e) => ErrorHandle.setError(e));
    return data;
  },
  async deleteFavoriteOffer(id) {
    let url = "favorite-offers/" + id;
    let data = false;
    await axios
      .delete(url)
      .then((Response) => {
        data = SuccessHandler.getData(Response);
      })
      .catch((e) => ErrorHandle.setError(e));
    return data;
  },

  async getOffer(id) {
    let url =
      "oldDb/objects/offers/" +
      id +
      "?expand=contacts.emails,contacts.phones,contacts.websites,contacts.contactComments,broker,companyGroup,consultant,consultant.userProfile,categories,productRanges,files,dealsRequestEmpty.consultant.userProfile,dealsRequestEmpty.offer.generalOffersMix,dealsRequestEmpty.competitor";
    let data = false;
    await axios
      .get(url)
      .then((Response) => {
        data = SuccessHandler.getData(Response);
      })
      .catch((e) => ErrorHandle.setError(e));
    console.log(data);
    return data;
  },
};
