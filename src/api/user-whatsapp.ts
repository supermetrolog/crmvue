import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData';
import { User } from '@/types/user';
import { UserTelegramLinkTicket } from '@/types/integration/user-telegram-link-ticket';
import { RequestQueryParams } from '@/api/types';
import { UserWhatsappLink } from '@/types/integration/user-whatsapp-link';

const URL = '/integration/whatsapp';

type UserWhatsappLinkStatus = {
    linked: boolean;
    phone: string;
    first_name: string | null;
    full_name: string | null;
    push_name: string | null;
};

async function status() {
    const response = await axios.post(`${URL}/status`);
    return responseToData<UserWhatsappLinkStatus>(response);
}

type LinkUserWhatsappRequestDto = {
    phone: string;
};

async function link(params: LinkUserWhatsappRequestDto) {
    const response = await axios.post(`${URL}/link`, params);
    return responseToData<UserWhatsappLinkStatus>(response);
}

async function revoke() {
    const response = await axios.post(`${URL}/revoke`);
    return responseToData(response);
}

async function adminList(params: RequestQueryParams = {}) {
    const response = await axios.get(`${URL}/admin/list`, { params });
    return responseToPaginatedData<UserWhatsappLink>(response);
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
