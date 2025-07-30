import { Identifiable, SoftDelete, Timestamps } from '@/types/base';
import { Contact } from '@/types/contact/contact';
import { User } from '@/types/user';

export interface Call extends Identifiable, SoftDelete, Timestamps {
    phone_id: number;
    user_id: number;
    contact_id: number;
    description: string | null;
    status: number;
    type: number;
    contact?: Contact;
    user?: User;
}
