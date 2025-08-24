export const MessageTemplateKindEnum = {
    RESUME_COMPANY_COOPERATION: 'resume-company-cooperation'
} as const;

export type MessageTemplateKind =
    (typeof MessageTemplateKindEnum)[keyof typeof MessageTemplateKindEnum];

export const MessageTemplateChannelEnum = {
    EMAIL: 'email',
    MESSENGER: 'messenger'
} as const;

export type MessageTemplateChannel =
    (typeof MessageTemplateChannelEnum)[keyof typeof MessageTemplateChannelEnum];

export interface MessageTemplate {
    template: MessageTemplateKind;
    channel: MessageTemplateChannel;
    content: string;
    mime: string;
}
