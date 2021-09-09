import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async getCurrentStepObjects(object) {
        const url = `https://pennylane.pro/api/v1/get/index/?id=${object.object_id}&type_id=2`;

        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                data.duplicate_count = object.duplicate_count;
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async sendObjects(step_id, objects) {
        const url = `timeline/add-objects/${step_id}`;

        let data = false;
        await axios
            .post(url, objects)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                console.log("FUCK", data);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async getAllObjects(page_num) {
        const url = `https://pennylane.pro/api/v1/get/list/?request=fuck`;
        const formdata = new FormData();
        const params = {
            page_num: page_num,
            page_items: 9
        };
        formdata.append("request", JSON.stringify(params));
        let data = false;
        await axios
            .post(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                data = {
                    offers: data.offers,
                    pagination: {
                        totalCount: data.amount,
                        perPage: data.pages - data.page,
                        pageCount: data.pages,
                        currentPage: data.page,
                    }
                };
                console.warn(data.offers);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    }
}