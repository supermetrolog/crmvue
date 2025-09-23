import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData';
import {
    ShortUserNotification,
    UserNotification
} from '@/types/user-notification/user-notification';
import { RequestQueryParams } from '@/api/types';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData';

const URL = '/user-notifications';

async function get(id: number) {
    const response = await axios.get<UserNotification>(`${URL}/${id}`);
    return responseToData<UserNotification>(response);
}

async function list(params: RequestQueryParams = {}) {
    const response = await axios.get<ShortUserNotification[]>(URL, {
        params: { ...params, paginated: 1 }
    });
    return responseToPaginatedData(response);
}

async function load(params: RequestQueryParams = {}) {
    const response = await axios.get<ShortUserNotification[]>(URL, { params });
    return responseToData(response);
}

async function count() {
    const response = await axios.get<number>(`${URL}/user/count`);
    return responseToData<number>(response);
}

async function viewed(id: number) {
    const response = await axios.post<UserNotification>(`${URL}/${id}/viewed`);
    return responseToData<UserNotification>(response);
}

async function acted(id: number) {
    const response = await axios.post<UserNotification>(`${URL}/${id}/acted`);
    return responseToData<UserNotification>(response);
}

async function processAction(notificationId: number, actionId: number) {
    const response = await axios.post(`${URL}/${notificationId}/actions/${actionId}/process`);
    return responseToData(response);
}

async function actedAll() {
    const response = await axios.post<UserNotification>(`${URL}/user/acted-all`);
    return responseToData(response);
}

export interface SendUserNotificationDto {
    subject: string;
    message: string;
    channel: string;
    user_ids: number[];
    templated_id?: number;
    expires_at?: string;
    actions?: SendUserNotificationActionDto[];
}

export interface SendUserNotificationActionDto {
    label: string;
    code: string;
    type: string;
    order: number;
    icon?: string;
    style?: string;
    confirmation: boolean;
    expires_at?: string;
    payload: Record<string, any>;
}

async function send(dto: SendUserNotificationDto) {
    const response = await axios.post(`${URL}/send`, dto);
    return responseToData(response);
}

export default {
    get,
    list,
    count,
    viewed,
    acted,
    processAction,
    load,
    actedAll,
    send
};
