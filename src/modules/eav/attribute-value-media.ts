import { Identifiable, SoftDelete, Timestamps } from '@/types/base';

export interface AttributeValueMedia extends Identifiable, Timestamps, SoftDelete {
    attribute_id: number;
    entity_type: string;
    entity_id: number;
    media_id: number;
}
