import { Identifiable, Timestamps } from '@/types/base';
import { User } from '@/types/user';

export const ChatMemberModelTypeEnum = {
    USER: 'user',
    OBJECT: 'object',
    REQUEST: 'request',
    COMPANY: 'company'
} as const;

export type ChatMemberModelType =
    (typeof ChatMemberModelTypeEnum)[keyof typeof ChatMemberModelTypeEnum];

export interface ChatMemberModelMap {
    [ChatMemberModelTypeEnum.USER]: User;
    [ChatMemberModelTypeEnum.REQUEST]: unknown;
    [ChatMemberModelTypeEnum.COMPANY]: unknown;
    [ChatMemberModelTypeEnum.OBJECT]: unknown;
}

export type ChatMemberModel<T extends ChatMemberModelType> = ChatMemberModelMap[T];

export interface ChatMember<T extends ChatMemberModelType> extends Identifiable, Timestamps {
    model_id: string;
    model_type: T;
    model: ChatMemberModel<T>;
}
