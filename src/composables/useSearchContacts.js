import api from '@/api/api.js';
import { computed, ref, shallowRef } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';

export function useSearchContacts(companyID) {
    const contacts = shallowRef([]);
    const isLoading = ref(false);

    async function searchContacts(_companyID) {
        isLoading.value = true;

        const response = await api.contacts.getByCompany(
            _companyID == null ? companyID.value : _companyID
        );

        contacts.value = response.map(contact => ({
            value: contact.id,
            label: contact.type === 1 ? 'Основной контакт' : contact.full_name,
            type: contact.type,
            isMain: contact.isMain,
            position: contact.position_unknown
                ? 'Должность неизвестна'
                : contactOptions.position[contact.position],
            phone: contact.phones?.length ? contact.phones[0].phone : null,
            calls_count: contact.calls.length
        }));

        isLoading.value = false;
    }

    const filteredContacts = computed(() => contacts.value.filter(contact => contact.type !== 1));

    return { searchContacts, contacts, isLoading, filteredContacts };
}
