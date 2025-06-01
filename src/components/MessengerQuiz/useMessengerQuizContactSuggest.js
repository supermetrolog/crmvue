import { computed, ref, toValue } from 'vue';
import { isPersonalContact } from '@/utils/helpers/models/contact.js';

export function useMessengerQuizContactSuggest(contacts) {
    const selectedContactsSet = ref(new Set([]));

    const selectedContacts = ref([]);

    function selectContact(contact) {
        selectedContacts.value.push({
            entity: contact,
            form: {
                scheduled: null,
                available: null,
                action: null,
                reason: null,
                message: null
            }
        });

        selectedContactsSet.value.add(contact.id);
    }

    function changeLastContact(contact) {
        selectedContactsSet.value.delete(
            selectedContacts.value[selectedContacts.value.length - 1].entity.id
        );
        selectedContacts.value[selectedContacts.value.length - 1].entity = contact;
        selectedContactsSet.value.add(contact.id);
    }

    function contactIsSelected(contact) {
        return selectedContactsSet.value.has(contact.id);
    }

    const availableContacts = computed(() => toValue(contacts).filter(isPersonalContact));
    const notSelectedContacts = computed(() =>
        availableContacts.value.filter(contact => !contactIsSelected(contact))
    );

    return {
        availableContacts,
        notSelectedContacts,
        selectedContacts,
        selectContact,
        changeLastContact
    };
}
