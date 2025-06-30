import { User } from '@/types/user';
import { File } from '@/types/file';
import { Auditable, SoftDelete, Timestamps } from '@/types/base';

export interface TaskObserver extends Timestamps {
    id: number;
    user_id: number;
    user: User;
    created_by_id: number;
    viewed_at: string | null;
    task_id?: number;
}

export interface TaskTag extends Timestamps, SoftDelete {
    id: number;
    name: string;
    description?: string;
    color: string | null;
    task_id?: number;
}

export interface TaskRelatedBy {
    chat_member: object | null;
    chat_member_id: number | null;
    chat_member_message: object | null;
    chat_member_message_id: number | null;
}

export interface TaskComment extends Timestamps, SoftDelete, Auditable<User> {
    id: number;
    message: string;
    files: File[];
    task_id?: number;
}

export const TaskRelationEntityTypeEnum = {
    MANUAL: 'manual',
    SYSTEM: 'system'
} as const;

export type TaskRelationEntityType =
    (typeof TaskRelationEntityTypeEnum)[keyof typeof TaskRelationEntityTypeEnum];

export type TaskRelationEntityModel = User | Task;

export const TaskRelationEntityModelTypeEnum = {
    REQUEST: 'request',
    CONTACT: 'contact',
    USER: 'user',
    COMPANY: 'company',
    OBJECT: 'c_industry',
    SURVEY: 'survey'
};

export type TaskRelationEntityModelType =
    (typeof TaskRelationEntityModelTypeEnum)[keyof typeof TaskRelationEntityModelTypeEnum];

export interface TaskRelationEntity extends Timestamps, SoftDelete {
    id: number;
    comment: string | null;
    created_by_id: number | null;
    deleted_by_id: number | null;
    entity_id: number;
    entity_type: string;
    relation_type: TaskRelationEntityType;
    entity: TaskRelationEntityModel;
}

export const TaskTypeEnum = {
    BASE: 'base',
    SCHEDULED_CALL: 'scheduled_call',
    SCHEDULED_VISIT: 'scheduled_visit',
    SCHEDULED_EVENT: 'scheduled_event',
    REQUEST_HANDLING: 'request_handling',
    CONTACT_HANDLING: 'contact_handling',
    OBJECT_HANDLING: 'object_handling'
} as const;

export type TaskType = (typeof TaskTypeEnum)[keyof typeof TaskTypeEnum];

export const TaskStatusEnum = {
    CREATED: 1,
    ACCEPTED: 2,
    DONE: 3,
    IMPOSSIBLE: 4
} as const;

export type TaskStatus = (typeof TaskStatusEnum)[keyof typeof TaskStatusEnum];

export interface Task extends Timestamps, SoftDelete {
    id: number;
    title: string;
    message: string | null;
    type: TaskType;
    status: TaskStatus;
    start: string;
    end: string | null;
    is_viewed?: boolean;
    viewed_at?: string | null;
    impossible_to: string | null;
    created_by_id: string | null;
    created_by_type: string | null;
    created_by: User;
    user_id: number;
    user: User;
    tags?: TaskTag[];
    observers?: TaskObserver[];
}

export interface TaskView extends Task {
    last_comments: TaskComment[];
    comments_count: number;
    files_count: number;
    histories_count: number;
    relations_count: number;
    related_by: TaskRelatedBy;
}

export const TaskHistoryEventTypeEnum = {
    CREATED: 'created',
    STATUS_CHANGED: 'status_changed',
    ASSIGNED: 'assigned',
    DESCRIPTION_CHANGED: 'description_changed',
    TITLE_CHANGED: 'title_changed',
    STARTING_DATE_CHANGED: 'starting_date_changed',
    ENDING_DATE_CHANGED: 'ending_date_changed',
    TAGS_CHANGED: 'tags_changed',
    OBSERVERS_CHANGED: 'observers_changed',
    DELETED: 'deleted',
    RESTORED: 'restored',
    OBSERVED: 'observed',
    FILE_CREATED: 'file_created',
    FILE_DELETED: 'file_deleted',
    FILES_CHANGED: 'files_changed',
    POSTPONED: 'postponed'
} as const;

export type TaskHistoryEventType =
    (typeof TaskHistoryEventTypeEnum)[keyof typeof TaskHistoryEventTypeEnum];

export interface TaskHistoryEvent {
    id: number;
    created_at: string;
    event_type: TaskHistoryEventType;
    task_history_id: number;
}

export interface TaskHistorySnapshot {
    id?: number;
    status: TaskStatus;
    title: string;
    message: string | null;
    start: string;
    end: string | null;
    files: File[];
    impossible_to: string | null;
    observers: TaskObserver[];
    tags: TaskTag[];
    user_id: number;
    user: User;
    created_at: string;
}

export interface TaskHistory extends Auditable<User> {
    id: number;
    prev_id: number | null;
    task_id: number;
    events: TaskHistoryEvent[];
    snapshot: TaskHistorySnapshot;
}
