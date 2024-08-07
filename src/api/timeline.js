import axios from 'axios';
import { setRequestError } from '@/api/helpers/setRequestError.js';
import { SuccessHandler } from '@/api/helpers/successHandler.js';

export default {
    async getTimeline(consultant_id, request_id) {
        const url = `timeline?consultant_id=${consultant_id}&request_id=${request_id}&expand=timelineSteps.timelineStepObjects.comments,timelineSteps.timelineStepObjects.offer.object,timelineSteps.timelineStepFeedbackways,timelineSteps.timelineActionComments,consultant,consultant.userProfile,timelineActionComments`;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async getTimelineComments(timeline_id) {
        const url = `timeline/action-comments/${timeline_id}`;
        let data = false;
        await axios
            .get(url)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async updateTimelineStep(newData) {
        const url = `timeline/update-step/${newData.id}`;
        let data = false;
        await axios
            .patch(url, newData)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async sendObjects(messageData) {
        const url = `timeline/send-objects`;
        let data = false;
        await axios
            .post(url, messageData)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    },
    async addActionComments(comments) {
        const url = `timeline/add-action-comments`;
        let data = false;
        await axios
            .post(url, comments)
            .then(Response => {
                data = SuccessHandler.getData(Response);
            })
            .catch(e => setRequestError(e));
        return data;
    }
};
