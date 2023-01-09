import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async get(id) {
        let url = "letters/" + id + "?expand=user.userProfile,letterOffers.offer.object,letterWays,letterPhones.phone.contact,letterEmails.email.contact";
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
}