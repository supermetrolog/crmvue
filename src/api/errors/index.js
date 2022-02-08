import { notify } from "@kyvg/vue3-notification";
import router from "@/router";
let notifyOptions = {
    group: "app",
    type: "error",
    duration: 15000,
};
const ValidationErrorHttpStatusCode = 422;
const AuthErrorHttpStatusCode = 401;
const getTitle = (data) => {
    return data.name;
    // return data.name + " - [ статус код: " + data.status + " ]";
}
const validationErrorSet = (data) => {
    data.message = JSON.parse(data.message);

    notifyOptions.title = getTitle(data);
    data.message.map((item) => {
        notifyOptions.text = item;
        notify(notifyOptions);
    })
}
const otherErrorSet = (data) => {
    notifyOptions.title = getTitle(data);

    notifyOptions.text = data.message;
    notify(notifyOptions);
    return;
}
export default {
    setError(e) {
        console.error(e);

        // e -> message, config, code, request, response
        if (e.response) {
            let data = e.response.data;

            if (data.status != ValidationErrorHttpStatusCode) {
                otherErrorSet(data);

            } else {
                validationErrorSet(data);

            }
            if (data.status == AuthErrorHttpStatusCode) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                router.push('/login');
            }
        }

    }
}