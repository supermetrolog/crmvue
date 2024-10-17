import api from '@/api/api.js';
import { multiselectAdapter } from '@/utils/adapters.js';
import { ref } from 'vue';

export function useSearchContacts(companyID) {
    const contacts = ref([]);

    async function searchContacts(_companyID) {
        const response = await api.contacts.list(
            _companyID == null ? { company_id: companyID.value } : { company_id: _companyID }
        );

        contacts.value = multiselectAdapter(response.data, 'id', contact =>
            contact.type === 1 ? 'Основной контакт' : contact.first_and_last_name
        );
    }

    return { searchContacts, contacts };
}
