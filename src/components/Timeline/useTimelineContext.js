import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { toValue } from '@vueuse/core';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';

export function useTimelineContext(step) {
    const store = useStore();
    const route = useRoute();

    const company = computed(() => store.state.Companies.company);
    const contacts = computed(() => {
        const mainContactIndex = store.state.CompanyContact.companyContacts.findIndex(
            element => element.isMain
        );
        if (mainContactIndex) {
            return [
                store.state.CompanyContact.companyContacts[mainContactIndex],
                ...store.state.CompanyContact.companyContacts.toSpliced(mainContactIndex, 1)
            ];
        }

        return store.state.CompanyContact.companyContacts;
    });

    const request = computed(() => {
        if (store.state.CompanyRequest.companyRequests?.length) {
            return store.state.CompanyRequest.companyRequests.find(
                request => request.id === Number(route.query.request_id)
            );
        }

        return null;
    });

    const data = ref(cloneObject(toValue(step)));

    watch(
        () => toValue(step),
        () => {
            data.value = cloneObject(toValue(step));
        }
    );

    return {
        company,
        contacts,
        request,
        data
    };
}