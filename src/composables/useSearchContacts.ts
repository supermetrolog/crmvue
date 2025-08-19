import api from '@/api/api.js';
import { computed, ref, shallowRef, toValue } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { MaybeRefOrGetter } from '@vueuse/core';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { ContactStatus, ContactStatusEnum, ContactType } from '@/types/contact/contact';
import { BooleanNumber } from '@/types/base';

export interface SearchedContact {
    value: number;
    label: string;
    type: ContactType;
    isMain: BooleanNumber | null;
    position: string;
    phone: string | null;
    calls_count: number;
    status: ContactStatus;
}

export function useSearchContacts(companyId: MaybeRefOrGetter<number>) {
    const contacts = shallowRef<SearchedContact[]>([]);
    const isLoading = ref(false);

    async function searchContacts(_companyId: number | null = null) {
        isLoading.value = true;

        try {
            const response = await api.contacts.getByCompany(
                isNullish(_companyId) ? toValue(companyId) : _companyId
            );

            if (response) {
                contacts.value = response.map(contact => ({
                    value: contact.id,
                    label: contact.type === 1 ? 'Основной контакт' : contact.full_name,
                    type: contact.type,
                    isMain: contact.isMain,
                    status: contact.status,
                    position:
                        contact.position_unknown || isNullish(contact.position)
                            ? 'Должность неизвестна'
                            : contactOptions.position[contact.position],
                    phone: contact.phones?.length ? contact.phones[0].phone : null,
                    calls_count: contact.calls!.length
                }));
            }
        } finally {
            isLoading.value = false;
        }
    }

    const filteredContacts = computed(() => {
        return contacts.value.filter(contact => contact.type !== 1);
    });

    const activeFilteredContacts = computed(() => {
        return filteredContacts.value.filter(
            contact => contact.status === ContactStatusEnum.ACTIVE
        );
    });

    return { searchContacts, contacts, isLoading, filteredContacts, activeFilteredContacts };
}
