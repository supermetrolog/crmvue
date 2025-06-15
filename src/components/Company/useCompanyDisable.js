import { ref, shallowRef } from 'vue';
import { useAsync } from '@/composables/useAsync.js';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';

export function useCompanyDisable() {
    const formIsVisible = ref(false);
    const disablingCompany = shallowRef(null);

    function disableCompany(company) {
        disablingCompany.value = company;
        formIsVisible.value = true;
    }

    function closeForm() {
        formIsVisible.value = false;
        disablingCompany.value = null;
    }

    const notify = useNotify();

    const { isLoading, execute: enableCompany } = useAsync(api.companies.enable, {
        onFetchResponse: () => {
            notify.success('Компания успешно восстановлена.');
        },
        confirmation: true,
        confirmationContent: {
            title: 'Восстановить компанию',
            message: 'Вы уверены, что хотите восстановить компанию из архива?'
        }
    });

    function onDisabledCompany(payload) {
        formIsVisible.value = false;

        disablingCompany.value.status = 0;
        Object.assign(disablingCompany.value, payload);
        disablingCompany.value = null;
    }

    return {
        disableCompany,
        disableFormIsVisible: formIsVisible,
        disablingCompany,
        closeDisableForm: closeForm,
        enableCompany,
        enableCompanyIsLoading: isLoading,
        onDisabledCompany
    };
}
