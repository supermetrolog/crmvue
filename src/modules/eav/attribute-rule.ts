import { Identifiable, SoftDelete, Timestamps } from '@/types/base';

export interface AttributeRule extends Identifiable, Timestamps, SoftDelete {
    attribute_id: number;
    attribute_group_id: number | null;
    entity_type: string;
    is_required: boolean | null;
    is_inheritable: boolean | null;
    is_editable: boolean | null;
    status: string;
    sort_order: number;
}
