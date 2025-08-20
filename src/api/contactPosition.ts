import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { ContactPosition } from '@/types/contact/contact';

const URL = '/contact-positions';

export async function list() {
    const response = await axios.get<ContactPosition[]>(URL);
    return responseToData(response);
}

export interface ContactRequestDto {
    slug: string;
    name: string;
    short_name?: string | null;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    sort_order?: number | null;
    is_active: boolean;
}

async function create(dto: ContactRequestDto) {
    const response = await axios.post<ContactPosition>(URL, dto);
    return responseToData(response);
}

async function update(id: number, dto: ContactRequestDto) {
    const response = await axios.put<ContactPosition>(`${URL}/${id}`, dto);
    return responseToData(response);
}

async function deleteContactPosition(id: number) {
    const response = await axios.delete(`${URL}/${id}`);
    return responseToData(response);
}

export default {
    list,
    create,
    update,
    delete: deleteContactPosition
};
