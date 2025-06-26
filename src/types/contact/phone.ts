import { BooleanNumber, Identifiable } from '@/types/base';

export interface Phone extends Identifiable {
    phone: string;
    exten: string | null;
    isMain: BooleanNumber | null;
    native_phone?: string;
    contact_id?: number;
}
