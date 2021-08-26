import { notify } from "@kyvg/vue3-notification";
let notifyOptions = {
    group: "app",
    type: "success",
    duration: 5000,
};
const notifSet = (response) => {
    const data = response.data;
    notifyOptions.title = response.statusText;
    if (Array.isArray(data.message)) {
        data.message.map((item) => {
            notifyOptions.text = item;
            notify(notifyOptions);
        })
    } else {
        notifyOptions.text = data.message;
        notify(notifyOptions);
    }
}
export default {
    getData(Response) {
        if (Response.data && typeof Response.data !== 'string') {
            if (!Array.isArray(Response.data) && "message" in Response.data) {
                notifSet(Response);
                return Response.data.data;
            }
        }
        return Response.data;
    },
    getPaginationData(Response) {
        return {
            totalCount: Response.headers["x-pagination-total-count"],
            perPage: Response.headers["x-pagination-per-page"],
            pageCount: Response.headers["x-pagination-page-count"],
            currentPage: Response.headers["x-pagination-current-page"],
        }
    }
}