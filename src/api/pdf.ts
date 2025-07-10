import { BooleanNumber } from '@/types/base';
import { responseToData } from '@/api/helpers/responseToData';
import axios from 'axios';

const URL = '/pdf/presentations';

type ObjectTypeId = 1 | 2 | 3;

interface PdfDownloadPayloadObject {
    original_id: number;
    object_id: number;
    type_id: ObjectTypeId;
}

interface PdfDownloadPayload {
    consultant: number;
    is_new: BooleanNumber;
    objects: PdfDownloadPayloadObject[];
}

export default {
    async download(payload: PdfDownloadPayload) {
        const response = await axios.post(`${URL}/download`, payload);
        return responseToData(response);
    }
};
