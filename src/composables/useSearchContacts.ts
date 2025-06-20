import api from '@/api/api.js';
import { computed, ref, shallowRef, toValue } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { MaybeRefOrGetter } from '@vueuse/core';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { CompanyContact } from '@/api/contacts';

export function useSearchContacts(companyId: MaybeRefOrGetter<number>) {
    const contacts = shallowRef<CompanyContact[]>([]);
    const isLoading = ref(false);

    async function searchContacts(_companyId: number | null = null) {
        isLoading.value = true;

        const response = await api.contacts.getByCompany(
            isNullish(_companyId) ? toValue(companyId) : _companyId
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
