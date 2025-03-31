import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/timeline';

export default {
    async get(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async getByConsultantAndRequest(consultantId, requestId) {
        const params = {
            consultant_id: consultantId,
            request_id: requestId,
            expand:
                'timelineSteps.timelineStepObjects.comments,' +
                'timelineSteps.timelineStepObjects.offer.object,' +
                'timelineSteps.timelineStepFeedbackways,' +
                'timelineSteps.timelineActionComments,' +
                'consultant,' +
                'consultant.userProfile,' +
                'timelineActionComments'
        };

        const response = await axios.get(URL, { params });
        return responseToData(response);
    },
    async getTimelineComments(timelineId) {
        const response = await axios.get(`${URL}/action-comments/${timelineId}`);
        return responseToData(response);
    },
    async updateTimelineStep(timelineStepId, payload) {
        const response = await axios.patch(`${URL}/update-step/${timelineStepId}`, payload);
        return responseToData(response);
    },
    async sendObjects(payload) {
        const response = await axios.post(`${URL}/send-objects`, payload);
        return responseToData(response);
    },
    async addActionComments(payload) {
        const response = await axios.post(`${URL}/add-action-comments`, payload);
        return responseToData(response);
    }
};
