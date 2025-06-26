import { BooleanNumber, Identifiable } from '@/types/base';

export interface Effect extends Identifiable {
    kind: string;
    title: string;
    description: string | null;
    active: BooleanNumber;
}
