import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

function getFormDataWithFiles(formdata1, forUpdate = false) {

    let formdata = {...formdata1 };
    let FD = new FormData();
    // for (let i = 0; i < formdata.fileList.length; i++) {
    //     FD.append("files[]", formdata.fileList[i]);
    // }
    delete formdata.fileList;
    let files = [];
    formdata.files.map(item => {
        let file = {};
        file.name = item.name;
        file.size = item.size;
        file.type = item.type;
        if (forUpdate) {
            file.id = item.id;
            file.filename = item.filename;
        } else {
            file.src = '';
        }
        files.push(file);
    });
    formdata.files = files;

    FD.append('data', JSON.stringify(formdata));
    return FD;
}
export default {
    async getCompanies() {
        const url = "companies?expand=contacts.emails,contacts.phones,contacts.contactComments,broker,companyGroup,consultant,productRanges,categories,files";
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async getCompany(id) {
        const url = "companies/" + id + "?expand=contacts.emails,contacts.phones,contacts.websites,contacts.contactComments,broker,companyGroup,consultant,categories,productRanges,files";
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async createCompany(formdata) {
        const url = "companies";
        let data = false;
        formdata = getFormDataWithFiles(formdata);

        let config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        };
        await axios
            .post(url, formdata, config)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                console.warn('Responce server: ', data);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async updateCompany(formdata) {
        const url = `companies/${formdata.id}`;
        let data = false;
        // formdata = getFormDataWithFiles(formdata, true);

        let config = {
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'multipart/form-data',
            // }
        };
        await axios
            .patch(url, formdata, config)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
}