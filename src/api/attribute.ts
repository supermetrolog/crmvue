import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData';
import { RequestQueryParams } from '@/api/types';
import { Attribute } from '@/modules/eav/attribute';
import { responseHasStatus } from '@/api/helpers/responseHasStatus';
import { STATUS_SUCCESS } from '@/api/helpers/statuses';

const URL = '/attributes';

async function get(id: number) {
    const response = await axios.get(`${URL}/${id}`);
    return responseToData<Attribute>(response);
}

async function search(params: RequestQueryParams = {}) {
    const response = await axios.get(URL, { params });
    return responseToPaginatedData<Attribute>(response);
}

export interface CreateAttributeDto {
    kind: string;
    label: string;
    description: string;
    value_type: string;
    input_type: string;
}

async function create(dto: CreateAttributeDto) {
    const response = await axios.post(URL, dto);
    return responseToData<Attribute>(response);
}

async function remove(id: number) {
    const response = await axios.delete(`${URL}/${id}`);
    return responseHasStatus(response, STATUS_SUCCESS);
}

export interface UpdateAttributeDto {
    label: string;
    description: string;
    value_type: string;
    input_type: string;
}

async function update(id: number, dto: UpdateAttributeDto) {
    const response = await axios.put(`${URL}/${id}`, dto);
    return responseToData<Attribute>(response);
}

export const attribute = {
    get,
    search,
    create,
    delete: remove,
    update
};
