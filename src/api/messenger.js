import api from '@//api/api';
import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.ts';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { responseHasStatus } from '@/api/helpers/responseHasStatus.js';
import { STATUS_SUCCESS } from '@/api/helpers/statuses.js';

const URL = '/chat-members';

export default {
    async getChats(params) {
        const response = await axios.get(URL, { params });
        return responseToPaginatedData(response);
    },
    async getPanel(companyID) {
        return await api.companies.getCompany(companyID);
    },
    async getUser(id) {
        return await api.user.get(id);
    },
    async getDialog(id) {
        const response = await axios.get(`${URL}/${id}`);
        return responseToData(response);
    },
    async getDialogByQuery(params) {
        const response = await axios.get(URL, { params });

        const data = responseToData(response);

        if (data?.length) return data[0];
        return null;
    },
    async getMessage(id) {
        const response = await axios.get(`/chat-member-messages/${id}`);
        return responseToData(response);
    },
    async getMessages(memberID, idLessThen = null) {
        const params = new URLSearchParams({ to_chat_member_id: memberID });
        if (idLessThen) params.append('id_less_then', idLessThen);

        const url = `/chat-member-messages?${params.toString()}`;

        const response = await axios.get(url);
        return responseToData(response);
    },
    async getMessagesByQuery(query) {
        const params = new URLSearchParams(query).toString();
        const url = `/chat-member-messages?${params}`;

        const response = await axios.get(url);
        return responseToPaginatedData(response);
    },
    async searchMessages(params) {
        const response = await axios.get(`/chat-member-messages/search`, { params });
        return responseToPaginatedData(response);
    },
    async pinMessage(memberID, messageID) {
        const url = `/chat-members/pin-message`;
        const payload = { chat_member_id: memberID, chat_member_message_id: messageID };

        const response = await axios.post(url, payload);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async unpinMessage(memberID) {
        const url = `/chat-members/unpin-message`;
        const payload = { chat_member_id: memberID };

        const response = await axios.post(url, payload);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async getPinned(dialogID) {
        const url = `/chat-members/${dialogID}/pinned-message`;

        const response = await axios.get(url);
        return responseToData(response);
    },
    async sendMessage(memberID, message) {
        const url = '/chat-member-messages';
        const formData = { ...message, to_chat_member_id: memberID };

        const response = await axios.postForm(url, formData);
        return responseToData(response);
    },
    async sendMessageWithTask(memberID, message, taskPayload) {
        const url = '/chat-member-messages/with-task';
        const formData = { ...message, to_chat_member_id: memberID, task: taskPayload };

        const response = await axios.post(url, formData);
        return responseToData(response);
    },
    async sendMessageWithTasks(memberID, message, taskPayloads) {
        const url = '/chat-member-messages/with-tasks';
        const formData = { ...message, to_chat_member_id: memberID, tasks: taskPayloads };

        const response = await axios.post(url, formData);
        return responseToData(response);
    },
    async updateMessage(message) {
        const url = `/chat-member-messages/${message.id}`;

        const response = await axios.putForm(url, message);
        return responseToData(response);
    },
    async getMedia(chatMemberID, { extension = null, page = 1 }) {
        const url =
            `/chat-members/${chatMemberID}/media` +
            (extension ? `?extension=${extension}&page=${page}` : `?page=${page}`);

        const response = await axios.get(url);
        return responseToPaginatedData(response);
    },
    async getUserChatMembers() {
        const [firstPart, secondPart, lastPart] = await Promise.all([
            axios.get('/chat-members?model_type=user'),
            axios.get('/chat-members?model_type=user&page=2'),
            axios.get('/chat-members?model_type=user&page=3')
        ]);

        const chatMembers = {};

        firstPart.data.forEach(element => (chatMembers[element.model_id] = element.id));
        secondPart.data.forEach(element => (chatMembers[element.model_id] = element.id));
        lastPart.data.forEach(element => (chatMembers[element.model_id] = element.id));

        return chatMembers;
    },
    async getUserChatMember(userID) {
        const response = await axios.get('/chat-members?model_type=user&model_id=' + userID);
        const data = responseToData(response);

        if (data?.length) return data[0].id;
        return null;
    },
    async readMessages(messageID) {
        const response = await axios.post('/chat-member-messages/view-message/' + messageID);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async getStatistics(chatMemberIds, modelTypes = ['object', 'request']) {
        const response = await axios.get(`${URL}/statistic`, {
            params: { chat_member_ids: chatMemberIds, model_types: modelTypes }
        });

        return responseToData(response);
    },
    async deleteMessage(id) {
        const response = await axios.delete(`/chat-member-messages/${id}`);
        return responseHasStatus(response, STATUS_SUCCESS);
    },
    async getChatMemberIdByQuery(params) {
        const response = await axios.get(URL, { params });
        const members = responseToData(response);

        if (members?.length) return members[0].id;
        return null;
    },
    async createTasks(messageId, payloads) {
        const url = `/chat-member-messages/create-tasks/${messageId}`;

        const response = await axios.post(url, { tasks: payloads });
        return responseToData(response);
    }
};
