import { shallowRef, toValue } from 'vue';
import { createOptionsComposable } from '@/composables/options/createOptionsComposable.js';
import api from '@/api/api.js';

export function useCompanyContactsOptions(companyId) {
    const contacts = shallowRef([]);

    async function fetchContacts() {
        contacts.value = await api.contacts.getByCompany({
            company_id: toValue(companyId),
            status: 1
        });
    }

    const {
        options: contactsOptions,
        refresh: refreshContactsOptions,
        getOptions: getContactsOptions,
        isFetching
    } = createOptionsComposable(contacts, fetchContacts);

    return {
        contactsOptions,
        refreshContactsOptions,
        getContactsOptions,
        isFetching
    };
}
