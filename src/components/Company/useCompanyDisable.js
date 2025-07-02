import { ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { captureException } from '@sentry/vue';
import { useConfirm } from '@/composables/useConfirm.js';

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
    const { confirm } = useConfirm();

    const isLoading = ref(false);

    async function enableCompany(company) {
        const confirmed = await confirm({
            title: 'Восстановить компанию',
            message: 'Вы уверены, что хотите восстановить компанию из архива?'
        });

        if (!confirmed) return;

        company.loading = true;
        isLoading.value = true;

        try {
            await api.companies.enable(company.id);

            company.status = 1;
            notify.success('Компания успешно восстановлена.');
        } catch (error) {
            captureException(error);
        } finally {
            company.loading = false;
            isLoading.value = false;
        }
    }

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
