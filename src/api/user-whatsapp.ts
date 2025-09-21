import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData';
import { UserTelegramLink } from '@/types/integration/user-telegram-link';
import { User } from '@/types/user';
import { UserTelegramLinkTicket } from '@/types/integration/user-telegram-link-ticket';
import { RequestQueryParams } from '@/api/types';

const URL = '/integration/whatsapp';

async function status() {
    const response = await axios.post(`${URL}/status`);
    return responseToData<UserTelegramLink>(response);
}

export type StartTelegramLinkResponse = {
    deep_link: string;
    code: string;
    expires_at: string;
};

async function link() {
    const response = await axios.post(`${URL}/start`);
    return responseToData<StartTelegramLinkResponse>(response);
}

async function revoke() {
    const response = await axios.post(`${URL}/revoke`);
    return responseToData(response);
}

export interface SearchedUserTelegramLink extends UserTelegramLink {
    user: User;
}

async function adminList(params: RequestQueryParams = {}) {
    const response = await axios.get(`${URL}/admin/list`, { params });
    return responseToPaginatedData<SearchedUserTelegramLink>(response);
}

export interface SearchedUserTelegramLinkTicket extends UserTelegramLinkTicket {
    user: User;
}

async function adminRevokeByUser(id: number) {
    const response = await axios.post(`${URL}/admin/revoke-user/${id}`);
    return responseToData(response);
}

async function adminRevokeByLink(id: number) {
    const response = await axios.post(`${URL}/admin/revoke-link/${id}`);
    return responseToData(response);
}

export default {
    link,
    status,
    revoke,
    admin: {
        list: adminList,
        revokeByUser: adminRevokeByUser,
        revokeByLink: adminRevokeByLink
    }
};
