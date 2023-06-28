import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

function getFormDataWithFiles(formdata1) {
    let formdata = {...formdata1 };
    let FD = new FormData();
    if (!formdata.userProfile.fileList) {
        FD.append('data', JSON.stringify(formdata));
        return FD;
    }
    for (let i = 0; i < formdata.userProfile.fileList.length; i++) {
        FD.append("files[]", formdata.userProfile.fileList[i]);
    }
    FD.append('data', JSON.stringify(formdata));
    return FD;
}
export default {
    auth: {
        async login(formdata) {
            const url = "users/login?expand=userProfile";
            let data = false;
            await axios
                .post(url, formdata)
                .then((Response) => {
                    data = SuccessHandler.getData(Response);
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                })
                .catch((e) => ErrorHandle.setError(e));
            return data;
        },
        async logout() {
            const url = "users/logout";
            let data = false;
            await axios
                .post(url)
                .then((Response) => {
                    data = SuccessHandler.getData(Response);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                })
                .catch((e) => ErrorHandle.setError(e));
            return data;
        }
    },
    async getUsers() {
        const url = "users?expand=userProfile.phones,userProfile.emails";
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async getUser(id) {
        const url = "users/" + id + "?expand=userProfile.phones,userProfile.emails";
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async createUser(formdata) {
        const url = "users";
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
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async updateUser(formdata) {
        const url = `users/${formdata.id}`;
        let data = false;
        formdata = getFormDataWithFiles(formdata);

        let config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        };
        await axios
            .patch(url, formdata, config)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async deleteUser(id) {
        const url = `users/${id}`;
        let data = false;
        await axios
            .delete(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
}