import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
export default {
    auth: {
        async login(formdata) {
            // const url = "users/login?expand=userProfiles";
            const url = "users/login";
            let data = false;
            await axios
                .post(url, formdata)
                .then((Response) => {
                    data = SuccessHandler.getData(Response);
                    console.log("USER", data);
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                })
                .catch((e) => ErrorHandle.setError(e));
            return data;
        },
        async logout() {
            console.log("logout");

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
    }

}