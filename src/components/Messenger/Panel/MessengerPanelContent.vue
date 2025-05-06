<template>
    <div class="messenger-panel__content">
        <div class="messenger-panel__section messenger-panel-section position-relative">
            <Loader v-if="isLoading" />
            <div v-if="company" class="messenger-panel-section__list">
                <MessengerPanelCompany
                    @disable="disableFormIsVisible = true"
                    @enable="enableCompany(company.id)"
                    @edit="companyFormIsVisible = true"
                    :company
                />
            </div>
            <EmptyData v-else no-rounded>Данные о компании не найдены..</EmptyData>
        </div>
        <Teleport to="body">
            <FormCompany
                v-if="companyFormIsVisible"
                @close="companyFormIsVisible = false"
                @updated="updateCompany"
                :form-data="company"
            />
            <FormCompanyDisable
                v-if="disableFormIsVisible"
                @close="disableFormIsVisible = false"
                @disabled="onDisabledCompany"
                :company
            />
        </Teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerPanelCompany from '@/components/Messenger/Panel/Company/MessengerPanelCompany.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import { computed, ref } from 'vue';
import FormCompanyDisable from '@/components/Forms/Company/FormCompanyDisable.vue';
import { useAsync } from '@/composables/useAsync.js';
import api from '@/api/api.js';
import Loader from '@/components/common/Loader.vue';
import { useNotify } from '@/utils/use/useNotify.js';

const store = useStore();

const companyFormIsVisible = ref(false);
const disableFormIsVisible = ref(false);

const company = computed(() => store.state.Messenger.currentPanel);

function updateCompany() {
    store.dispatch('Messenger/updatePanel');
}

const notify = useNotify();

const { isLoading, execute: enableCompany } = useAsync(api.companies.enable, {
    onFetchResponse: () => {
        notify.success('Компания успешно восстановлена.');
        updateCompany();
    },
    confirmation: true,
    confirmationContent: {
        title: 'Восстановить компанию',
        message: 'Вы уверены, что хотите восстановить компанию из архива?'
    }
});

function onDisabledCompany() {
    disableFormIsVisible.value = false;

    updateCompany();
}
</script>
