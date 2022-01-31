import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

const pennylaneAxios = axios.create({
    baseURL: 'https://pennylane.pro/api/v1/get/'
});
export default {
    async getCurrentStepObjects(objectsIdList) {
        const url = `list/`;
        const formdata = new FormData();
        const params = {
            offers_id: objectsIdList,
        };
        formdata.append("request", JSON.stringify(params));
        let data = false;
        await pennylaneAxios
            .post(url, formdata)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                data = data.offers;
            })
            .catch((e) => ErrorHandle.setError(e));

        return data;
    },
    async getCurrentStepObjectsOneByOne(objectList) {
        const url = `index/`;
        let data = false;
        let array = [];
        for (let index = 0; index < objectList.length; index++) {
            const item = objectList[index];
            let objectUrl = url + `?id=${item.object_id}&type_id=${item.type_id}`;
            await pennylaneAxios
                .get(objectUrl)
                .then((Response) => {
                    array.push(SuccessHandler.getData(Response));
                })
                .catch((e) => ErrorHandle.setError(e));
        }
        if (array.length) {
            data = array;
        }
        return data;
    },

    async getAllObjects(page_num) {
        const url = `list/`;
        const formdata = new FormData();
        const params = {
            page_num: page_num,
            page_items: 9
        };
        formdata.append("request", JSON.stringify(params));
        let data = false;
        await pennylaneAxios
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
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    }
}