import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData';
import { RequestQueryParams } from '@/api/types';
import { Attribute } from '@/modules/eav/attribute';
import { responseHasStatus } from '@/api/helpers/responseHasStatus';
import { STATUS_SUCCESS } from '@/api/helpers/statuses';
import { AttributeOption } from '@/modules/eav/attribute-option';

const URL = '/attribute-options';

async function get(id: number) {
    const response = await axios.get(`${URL}/${id}`);
    return responseToData<AttributeOption>(response);
}

async function search(params: RequestQueryParams = {}) {
    const response = await axios.get(URL, { params });
    return responseToPaginatedData<AttributeOption>(response);
}

export interface CreateAttributeOptionDto {
    attribute_id: number;
    label: string;
    value: string;
    sort_order: number;
}

async function create(dto: CreateAttributeOptionDto) {
    const response = await axios.post(URL, dto);
    return responseToData<AttributeOption>(response);
}

async function remove(id: number) {
    const response = await axios.delete(`${URL}/${id}`);
    return responseHasStatus(response, STATUS_SUCCESS);
}

export interface UpdateAttributeOptionDto {
    label: string;
    value: string;
    sort_order: number;
}

async function update(id: number, dto: UpdateAttributeOptionDto) {
    const response = await axios.put(`${URL}/${id}`, dto);
    return responseToData<Attribute>(response);
}

export const attributeOption = {
    get,
    search,
    create,
    delete: remove,
    update
};
