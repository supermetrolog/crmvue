import { BooleanNumber, Identifiable } from '@/types/base';

export interface Email extends Identifiable {
    email: string;
    isMain: BooleanNumber | null;
    contact_id?: number;
}
