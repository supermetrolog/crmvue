import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    async login(formdata) {
        const url = "users/login";
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
    logout() {
        console.log("logout");
    }
}