import { Identifiable, SoftDelete, Timestamps } from '@/types/base';

export interface AttributeOption extends Identifiable, Timestamps, SoftDelete {
    attribute_id: number;
    label: string | null;
    value: string;
    sort_order: number;
}
