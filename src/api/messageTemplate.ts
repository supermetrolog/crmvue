import axios from 'axios';
import { responseToData } from '@/api/helpers/responseToData.js';
import { RequestQueryParams } from '@/api/types';
import {
    MessageTemplate,
    MessageTemplateChannel,
    MessageTemplateKind
} from '@/types/message-template';

const URL = '/message-templates';

export type MessageTemplateRenderParams = RequestQueryParams & {
    channel: MessageTemplateChannel;
};

async function render(template: MessageTemplateKind, params: MessageTemplateRenderParams) {
    const response = await axios.get<MessageTemplate>(`${URL}/render/${template}`, { params });
    return responseToData(response);
}

export default {
    render
};
