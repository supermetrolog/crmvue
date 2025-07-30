import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData.js';
import { Phone, PhoneCountryCode, PhoneType } from '@/types/contact/phone';
import {
    Contact,
    ContactPassiveWhy,
    ContactPosition,
    ContactStatus
} from '@/types/contact/contact';
import { BooleanNumber } from '@/types/base';
import { RequestQueryParams } from '@/api/types';
import { Website } from '@/types/contact/website';
import { confirmResponse } from '@/api/helpers/confirmResponse';

const URL = '/contacts';

async function getByCompany(companyId: number) {
    const expand =
        'contactComments,contactComments.author,contactComments.author.userProfile,' +
        'emails,phones,invalidPhones,websites,wayOfInformings,' +
        'consultant,consultant.userProfile';
    const sort = '-created_at';

    const response = await axios.get(`${URL}/company-contacts/${companyId}`, {
        params: { expand, sort }
    });

    return responseToData<Contact[]>(response);
}

async function get(id: number) {
    const response = await axios.get(`${URL}/${id}`);
    return responseToData(response);
}

async function search(params: RequestQueryParams = {}) {
    const response = await axios.get(URL, { params });
    return responseToPaginatedData(response);
}

export interface BaseContactRequestDto {
    first_name: string;
    middle_name: string | null;
    last_name: string | null;
    position: ContactPosition | null;
    position_unknown: BooleanNumber;
    faceToFaceMeeting: BooleanNumber | null;
    passive_why: ContactPassiveWhy | null;
    passive_why_comment: string | null;
    consultant_id: number | null;
    warning: BooleanNumber | null;
    warning_why_comment: string | null;
    good: BooleanNumber | null;
    status: ContactStatus | null;
    isMain: BooleanNumber | null;
    emails: object[];
    websites: Website[];
    wayOfInformings: object[];
}

export interface CreateContactRequestDto extends BaseContactRequestDto {
    company_id: number;
}

async function create(dto: CreateContactRequestDto) {
    const response = await axios.post(URL, dto);
    return responseToData(response);
}

export type UpdateContactRequestDto = BaseContactRequestDto;

async function update(id: number, dto: UpdateContactRequestDto) {
    const response = await axios.put(`${URL}/${id}`, dto);
    return responseToData(response);
}

async function deleteContact(id: number) {
    const response = await axios.delete(`${URL}/${id}`);
    return responseToData(response);
}

export interface ContactCreateCommentRequestDto {
    text: string;
}

async function createComment(dto: ContactCreateCommentRequestDto) {
    const response = await axios.post(`${URL}/create-comment`, dto);
    return responseToData(response);
}

export interface DisableContactRequestDto {
    passive_why: ContactPassiveWhy;
    passive_why_comment: string | null;
}

async function disable(id: number, dto: DisableContactRequestDto) {
    const response = await axios.post(`${URL}/${id}/disable`, dto);
    return responseToData(response);
}

async function enable(id: number) {
    const response = await axios.post(`${URL}/${id}/enable`);
    return responseToData(response);
}

async function phones(id: number) {
    const response = await axios.get(`${URL}/${id}/phones`);
    return responseToData<Phone[]>(response);
}

export interface ContactAddPhoneRequestDto {
    phone: string;
    country_code: PhoneCountryCode;
    type: PhoneType;
    comment: string | null;
    exten: string | null;
    isMain: BooleanNumber | null;
}

async function addPhone(id: number, dto: ContactAddPhoneRequestDto) {
    const response = await axios.post(`${URL}/${id}/phones`, dto);
    return responseToData(response);
}

export interface ChangeContactCompanyRequestDto {
    disable_contact: BooleanNumber;
    company_id: number;
    consultant_id: number;
}

async function transferToCompany(id: number, dto: ChangeContactCompanyRequestDto) {
    const response = await axios.post(`${URL}/${id}/transfer-to-company`, dto);
    confirmResponse(response);
}

export default {
    getByCompany,
    get,
    search,
    create,
    update,
    delete: deleteContact,
    createComment,
    disable,
    enable,
    phones,
    addPhone,
    transferToCompany
};
