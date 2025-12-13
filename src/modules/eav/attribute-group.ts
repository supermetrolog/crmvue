import { Identifiable, SoftDelete, Timestamps } from '@/types/base';

export interface AttributeGroup extends Identifiable, Timestamps, SoftDelete {
    name: string;
}
