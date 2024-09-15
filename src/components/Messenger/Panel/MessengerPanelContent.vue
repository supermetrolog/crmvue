<template>
    <div class="messenger-panel__content">
        <div class="messenger-panel__section messenger-panel-section">
            <div v-if="company" class="messenger-panel-section__list">
                <MessengerPanelCompany @edit="companyFormIsVisible = true" :company="company" />
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
        </Teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerPanelCompany from '@/components/Messenger/Panel/Company/MessengerPanelCompany.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import { computed, shallowRef } from 'vue';

const store = useStore();

const companyFormIsVisible = shallowRef(false);

const company = computed(() => store.state.Messenger.currentPanel);

const updateCompany = async () => {
    await store.dispatch('Messenger/updatePanel');
};
</script>
