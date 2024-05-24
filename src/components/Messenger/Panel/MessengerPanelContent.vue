<template>
    <div class="messenger-panel__content">
        <div class="messenger-panel__section messenger-panel-section">
            <p class="messenger-panel-section__name">Собственники (1)</p>
            <div v-if="company" class="messenger-panel-section__list">
                <MessengerPanelCompany @edit="companyFormIsVisible = true" :company="company" />
            </div>
            <EmptyData v-else no-rounded>Данные о компании не найдены..</EmptyData>
        </div>
        <div class="messenger-panel__section messenger-panel-section">
            <p class="messenger-panel-section__name">Арендаторы (0)</p>
            <InProgress />
        </div>
        <Teleport to="body">
            <FormCompany
                v-if="companyFormIsVisible"
                @closeCompanyForm="companyFormIsVisible = false"
                @updated="updateCompany"
                :formdata="company"
            />
        </Teleport>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import MessengerPanelCompany from '@/components/Messenger/Panel/Company/MessengerPanelCompany.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import InProgress from '@/components/common/InProgress.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';

export default {
    name: 'MessengerPanelContent',
    components: { FormCompany, InProgress, EmptyData, MessengerPanelCompany },
    data() {
        return {
            companyFormIsVisible: false
        };
    },
    computed: {
        ...mapState({ company: state => state.Messenger.currentPanel })
    },
    methods: {
        ...mapActions({ updateCompany: 'Messenger/updatePanel' })
    }
};
</script>
