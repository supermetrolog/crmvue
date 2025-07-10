import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';

const URL = '/utilities';

export interface TransferCompaniesToConsultantPayload {
    company_ids: number[];
}

export default {
    async transferCompaniesToConsultant(
        consultantId: number,
        payload: TransferCompaniesToConsultantPayload
    ) {
        const response = await axios.post(
            `${URL}/transfer-companies-to-consultant/${consultantId}`,
            payload
        );
        return responseToData(response);
    }
};
