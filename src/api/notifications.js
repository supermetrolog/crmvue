import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";
import { notify } from "@kyvg/vue3-notification";
let notifyOptions = {
    group: "app",
    type: "success",
    duration: 5000,
};

function viewNotify(data) {
    const newNotificationCount = data.filter(
        (item) => item.status == -1
    ).length;
    if (newNotificationCount) {

        if (newNotificationCount == 1) {
            notifyOptions.text = `У вас ${newNotificationCount} новое оповещение`;
        } else {
            notifyOptions.text = `У вас ${newNotificationCount} новых оповещений`;

        }
        notifyOptions.title = `Оповещение`;
        console.log(newNotificationCount);

        notify(notifyOptions);
    }
}
export default {
    async fetchNotifications(consultant_id, page) {
        const url = `notifications/${consultant_id}?per-page=${page * 10}&sort=-created_at`;
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
    async fetchNewNotificationForNotif(consultant_id) {
        const url = `notifications/new/${consultant_id}`;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                viewNotify(data);
            })
            .catch((e) => ErrorHandle.setError(e));
    },
    async viewed(consultant_id) {
        const url = `notifications/${consultant_id}/viewed`;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) =>
                ErrorHandle.setError(e))

        return data;
    },
    logout() {
        console.log("logout");
    }
}