import { computed, ref, toValue } from 'vue';

export function useMessengerQuizTaskSuggest(contacts) {
    const alreadySelectedContactsSet = ref(new Set([]));

    const availableContacts = computed(() =>
        toValue(contacts).filter(contact => !alreadySelectedContactsSet.value.has(contact.id))
    );

    const unavailableContacts = computed(() =>
        toValue(contacts).filter(contact => alreadySelectedContactsSet.value.has(contact.id))
    );

    function markContactAsUnavailable(contact) {
        alreadySelectedContactsSet.value.add(contact.id);
    }

    return { availableContacts, unavailableContacts, markContactAsUnavailable };
}
