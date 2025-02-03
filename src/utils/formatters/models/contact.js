import { isGeneralContact } from '@/utils/helpers/models/contact.js';

export function getContactFullName(contact) {
    if (isGeneralContact(contact)) return 'Общий контакт';
    if (contact.full_name) return contact.full_name;
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
}
