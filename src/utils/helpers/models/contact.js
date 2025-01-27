import { contactOptions } from '@/const/options/contact.options.js';

export function isGeneralContact(contact) {
    return contact.type === contactOptions.typeStatement.GENERAL;
}

export function isPersonalContact(contact) {
    return contact.type === contactOptions.typeStatement.PERSONAL;
}
