<template>
    <div class="messenger-panel">
        <MessengerPanelLoader v-if="isLoading" />
        <MessengerPanelEmpty v-else-if="!hasPanel" />
        <MessengerPanelContent v-if="hasPanel" v-show="!isLoading" />
    </div>
</template>
<script>
import MessengerPanelContent from '@/components/Messenger/Panel/MessengerPanelContent.vue';
import MessengerPanelEmpty from '@/components/Messenger/Panel/MessengerPanelEmpty.vue';
import MessengerPanelLoader from '@/components/Messenger/Panel/MessengerPanelLoader.vue';
import { mapState } from 'vuex';
import { LoaderMixin } from '@/components/Messenger/loader.mixin';

export default {
    name: 'MessengerPanel',
    components: { MessengerPanelLoader, MessengerPanelEmpty, MessengerPanelContent },
    mixins: [LoaderMixin],
    computed: {
        ...mapState({
            hasPanel: state => state.Messenger.currentAsideDialogID,
            originalLoader: state => state.Messenger.loadingPanel
        })
    }
};
</script>
