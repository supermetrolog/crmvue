import axios from 'axios';
import { RequestQueryParams } from '@/api/types';
import { responseToPaginatedData } from '@/api/helpers/responseToPaginatedData';

const URL = '/user-notification-action-logs';

async function list(params: RequestQueryParams = {}) {
    const response = await axios.get(URL, { params });
    return responseToPaginatedData(response);
}

export default {
    list
};
