import api from '@//api/api';
import files from '@//test-data/files.json';
import photos from '@//test-data/photos.json';
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
    async getMessages(memberID, page = 1) {
        const params = new URLSearchParams({ to_chat_member_id: memberID, page }).toString();
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
            const response = await axios.post(url, formData);
            return response.data;
        } catch (e) {
            ErrorHandle.setError(e);
            return null;
        }
    },
    async getFiles() {
        return files;
    },
    async getPhotos() {
        return photos;
    },
    async getQuizzes() {
        return quizzes;
    }
};
