import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async getCurrentStepObjects(object) {
        const url = `https://pennylane.pro/api/v1/get/index/?id=${object.object_id}&type_id=2`;
        // const url = "requests/company-requests/1?expand=consultant,directions,districts,gateTypes,objectClasses,objectTypes,regions";

        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async getAllObjects() {
        const url = `https://pennylane.pro/api/v1/get/list/`;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    }
}