import { Identifiable, SoftDelete } from '@/types/base';
import { User } from '@/types/user';

export interface Letter extends Identifiable {
    user_id: number;
    subject: string | null;
    body: string | null;
    status: 0 | 1;
    type: number;
    shipping_method: number;
    sender_email: string | null;
    created_at: string;
    user?: User;
}

export interface LetterContact extends Identifiable {
    letter_id: number;
    contact_id: number;
    phone: string | null;
    email: string | null;
    created_at: string;

    letter?: Letter;
    answers: LetterContactAnswer[];
}

export interface LetterContactAnswer extends Identifiable, SoftDelete {
    letter_contact_id: number;
    marked_by_id: number;
    marked_at: string;
    type: string;
    comment: string | null;
    related_message_id: string | null;

    marked_by?: User;
}
