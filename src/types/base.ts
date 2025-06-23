export interface Timestamps {
    created_at: string;
    updated_at: string;
}

export interface SoftDelete {
    deleted_at: string | null;
}

export interface Auditable<T> {
    created_by_id: number;
    created_by: T;
}
