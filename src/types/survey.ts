import { SoftDelete, Timestamps } from '@/types/base';
import { User } from '@/types/user';
import { Contact } from '@/types/contact/contact';
import { Call } from '@/types/call';
import { Question } from '@/types/survey/question';
import { Task } from '@/types/task';
import { ChatMember, ChatMemberModelType } from '@/types/chat-member/chat-member';

export const SurveyTypeEnum = {
    BASE: 'base',
    ADVANCED: 'advanced'
} as const;

export type SurveyType = (typeof SurveyTypeEnum)[keyof typeof SurveyTypeEnum];

export const SurveyStatusEnum = {
    DRAFT: 'draft',
    COMPLETED: 'completed',
    CANCELED: 'canceled',
    DELAYED: 'delayed'
} as const;

export type SurveyStatus = (typeof SurveyStatusEnum)[keyof typeof SurveyStatusEnum];

export interface Survey<T extends ChatMemberModelType = 'company'> extends Timestamps, SoftDelete {
    id: number;
    description: string | null;
    user_id: number;
    user: User;
    type: SurveyType;
    status: SurveyStatus;
    contact_id: number | null;
    contact: Contact | null;
    completed_at: string | null;
    comment: string | null;
    chat_member_id: number;
    chatMember: ChatMember<T>;
}

export interface SurveyView<T extends ChatMemberModelType = 'company'> extends Survey<T> {
    calls: Call[];
    dependentSurveys: Survey[];
    questions: Question[];
    related_survey_id: number | null;
    relatedSurvey: Survey | null;
    tasks: Task[];
}
