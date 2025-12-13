import { Identifiable, SoftDelete, Timestamps } from '@/types/base';

export interface AttributeValue extends Identifiable, Timestamps, SoftDelete {
    attribute_id: number;
    entity_type: string;
    entity_id: number;
    value: string | null;
}
