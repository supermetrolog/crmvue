import api from '@/api/api.js';
import { ref, shallowRef } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';

export function useSearchContacts(companyID) {
    const contacts = shallowRef([]);
    const isLoading = ref(false);

    async function searchContacts(_companyID) {
        isLoading.value = true;

        const response = await api.contacts.list(
            _companyID == null ? { company_id: companyID.value } : { company_id: _companyID }
        );

        contacts.value = response.data.map(contact => ({
            value: contact.id,
            label: contact.type === 1 ? 'Основной контакт' : contact.full_name,
            isMain: contact.isMain,
            position: contact.position_unknown
                ? 'Должность неизвестна'
                : contactOptions.position[contact.position],
            phone: contact.phones?.length ? contact.phones[0].phone : null
        }));

        isLoading.value = false;
    }

    return { searchContacts, contacts, isLoading };
}
