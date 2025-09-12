import axios from 'axios';
import { RequestQueryParams } from '@/api/types';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData';
import { responseToData } from '@/api/helpers/responseToData';
import { BooleanNumber } from '@/types/base';
import { UserNotificationTemplate } from '@/types/user-notification/user-notification-template';

const URL = '/user-notification-templates';

async function get(id: number) {
    const response = await axios.get(`${URL}/${id}`);
    return responseToData<UserNotificationTemplate>(response);
}

async function list(params: RequestQueryParams = {}) {
    const response = await axios.get(URL, { params });
    return responseToPaginatedData(response);
}

export interface CreateUserNotificationTemplateRequestDto {
    kind: string;
    priority: string;
    category: string;
    is_active: BooleanNumber;
}

async function create(dto: CreateUserNotificationTemplateRequestDto) {
    const response = await axios.post(URL, dto);
    return responseToData<UserNotificationTemplate>(response);
}

export type UpdateUserNotificationTemplateRequestDto = Omit<
    CreateUserNotificationTemplateRequestDto,
    'kind'
>;

async function update(id: number, dto: UpdateUserNotificationTemplateRequestDto) {
    const response = await axios.put(`${URL}/${id}`, dto);
    return responseToData<UserNotificationTemplate>(response);
}

async function disable(id: number) {
    const response = await axios.post(`${URL}/${id}/disable`);
    return responseToData(response);
}

async function enable(id: number) {
    const response = await axios.post(`${URL}/${id}/enable`);
    return responseToData(response);
}

async function deleteEntity(id: number) {
    const response = await axios.post(`${URL}/${id}`);
    return responseToData(response);
}

export default {
    get,
    list,
    create,
    update,
    disable,
    enable,
    delete: deleteEntity
};
