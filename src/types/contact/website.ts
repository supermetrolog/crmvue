import { Identifiable } from '@/types/base';

export interface Website extends Identifiable {
    website: string;
    contact_id?: number;
}
