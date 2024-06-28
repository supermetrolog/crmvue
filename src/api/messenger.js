import api from '@//api/api';
import quizzes from '@//test-data/quizzes.json';
import axios from 'axios';
import SuccessHandler from '@/api/success/index.js';
import ErrorHandle from '@/api/errors/index.js';

export default {
    async getChats(options) {
        const params = new URLSearchParams(options).toString();
        const url = `/chat-members?${params}`;

        try {
            const response = await axios.get(url);

            return {
                data: SuccessHandler.getData(response),
                pagination: SuccessHandler.getPaginationData(response)
            };
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getPanel(companyID) {
        return await api.companies.getCompany(companyID);
    },
    async getDialog(dialogID) {
        const url = `/chat-members/${dialogID}`;

        try {
            const response = await axios.get(url);
            return response.data ?? null;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getDialogByQuery(query) {
        const params = new URLSearchParams(query).toString();
        const url = `/chat-members?${params}`;

        try {
            const response = await axios.get(url);
            return response.data?.length ? response.data[0] : null;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getMessages(memberID, idLessThen = null) {
        const params = new URLSearchParams({ to_chat_member_id: memberID });
        if (idLessThen) params.append('id_less_then', idLessThen);

        const url = `/chat-member-messages?${params.toString()}`;

        try {
            const response = await axios.get(url);
            return SuccessHandler.getData(response);
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getMessagesByQuery(query) {
        const params = new URLSearchParams(query).toString();
        const url = `/chat-member-messages?${params}`;

        try {
            const response = await axios.get(url);
            return {
                data: SuccessHandler.getData(response),
                pagination: SuccessHandler.getPaginationData(response)
            };
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async pinMessage(memberID, messageID) {
        const url = `/chat-members/pin-message`;
        const payload = { chat_member_id: memberID, chat_member_message_id: messageID };

        try {
            const response = await axios.post(url, payload);
            return response.status === 200;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async unpinMessage(memberID) {
        const url = `/chat-members/unpin-message`;
        const payload = { chat_member_id: memberID };

        try {
            const response = await axios.post(url, payload);
            return response.status === 200;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getPinned(dialogID) {
        const url = `/chat-members/${dialogID}/pinned-message`;

        try {
            const response = await axios.get(url);
            return response.data ?? null;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async sendMessage(memberID, message) {
        const url = '/chat-member-messages';
        const formData = { ...message, to_chat_member_id: memberID };

        try {
            const response = await axios.postForm(url, formData);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async updateMessage(message) {
        const url = `/chat-member-messages/${message.id}`;

        try {
            const response = await axios.patchForm(url, message);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getMedia(chatMemberID, { extension = null, page = 1 }) {
        const url =
            `/chat-members/${chatMemberID}/media` +
            (extension ? `?extension=${extension}&page=${page}` : `?page=${page}`);

        try {
            const response = await axios.get(url);
            return {
                data: SuccessHandler.getData(response),
                pagination: SuccessHandler.getPaginationData(response)
            };
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getQuizzes() {
        return quizzes;
    },
    async getUserChatMembers() {
        try {
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
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getUserChatMember(userID) {
        try {
            const response = await axios.get('/chat-members?model_type=user&model_id=' + userID);

            return response?.data?.length ? response.data[0].id : null;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getCounters(userID) {
        try {
            const response = await Promise.all([
                api.task.getCount({ deleted: 0, user_id: userID }),
                api.task.getCount({ deleted: 0, status: 3, user_id: userID })
            ]);

            return { tasks: response[0] - response[1] };
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async readMessages(messageID) {
        try {
            const response = await axios.post('/chat-member-messages/view-message/' + messageID);
            return response.status === 200;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    }
};
