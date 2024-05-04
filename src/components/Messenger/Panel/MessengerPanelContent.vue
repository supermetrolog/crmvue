<template>
    <div class="messenger-panel__content">
        <div class="messenger-panel__section messenger-panel-section">
            <p class="messenger-panel-section__name">Собственники (1)</p>
            <div v-if="company" class="messenger-panel-section__list">
                <MessengerPanelCompany :company="company" />
            </div>
            <EmptyData v-else no-rounded>Данные о компании не найдены..</EmptyData>
        </div>
        <div class="messenger-panel__section messenger-panel-section">
            <p class="messenger-panel-section__name">Арендаторы (0)</p>
            <InProgress />
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import MessengerPanelCompany from '@/components/Messenger/Panel/Company/MessengerPanelCompany.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import InProgress from '@/components/common/InProgress.vue';

export default {
    name: 'MessengerPanelContent',
    components: { InProgress, EmptyData, MessengerPanelCompany },
    computed: {
        ...mapState({ company: state => state.Messenger.currentPanel })
    }
};
</script>
