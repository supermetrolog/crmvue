export interface File {
    id: number;
    category: string;
    name: string;
    original_name: string;
    path: string;
    src: string;
    extension: string;
    mime_type: string;
    model_id: string;
    model_type: string;
    created_at: string;
    deleted_at: string | null;
}
