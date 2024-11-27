export function getContactFullName(contact) {
    if (contact.full_name) return contact.full_name;
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
}