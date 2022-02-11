import axios from "axios";
import ErrorHandle from "./errors";
import SuccessHandler from "./success";

export default {
    async getTimeline(consultant_id, request_id) {
        const url = `timeline?consultant_id=${consultant_id}&request_id=${request_id}&expand=timelineSteps,timelineSteps.timelineStepObjects,timelineSteps.timelineStepObjects.comments,timelineSteps.timelineStepFeedbackways,timelineSteps.timelineActionComments,consultant,consultant.userProfile,timelineActionComments`;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                console.log("Timeline", data);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async getTimelineComments(timeline_id) {
        const url = `timeline/action-comments/${timeline_id}`;
        let data = false;
        await axios
            .get(url)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
                console.log("comments", data);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    },
    async updateTimelineStep(newData) {
        const url = `timeline/update-step/${newData.id}`;
        let data = false;
        await axios
            .patch(url, newData)
            .then((Response) => {
                data = SuccessHandler.getData(Response);
            })
            .catch((e) => ErrorHandle.setError(e));
        return data;
    }

}