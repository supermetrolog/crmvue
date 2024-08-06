<template>
    <div class="messenger-aside">
        <MessengerAsideHeader />
        <div class="messenger-aside__body">
            <MessengerAsideObjects
                :objects="chatMembersObjects.data"
                :pagination="chatMembersObjects.pagination"
            />
            <MessengerAsideRequests
                :requests="chatMembersRequests.data"
                :pagination="chatMembersRequests.pagination"
            />
        </div>
    </div>
</template>
<script>
import MessengerAsideHeader from '@/components/Messenger/Aside/MessengerAsideHeader.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import MessengerAsideObjects from '@/components/Messenger/Aside/MessengerAsideObjects.vue';
import MessengerAsideRequests from '@/components/Messenger/Aside/MessengerAsideRequests.vue';

export default {
    name: 'MessengerAside',
    components: {
        MessengerAsideObjects,
        MessengerAsideRequests,
        MessengerAsideHeader
    },
    computed: {
        ...mapGetters(['Messenger/hasQuery', 'Messenger/hasDialogs']),
        ...mapState({
            chatMembersObjects: state => state.Messenger.chatMembersObjects,
            chatMembersRequests: state => state.Messenger.chatMembersRequests
        })
    },
    methods: {
        ...mapActions({ updateDialogs: 'Messenger/updateDialogs' })
    },
    created() {
        if (!this.hasQuery && !this.hasDialogs) this.updateDialogs();
    }
};
</script>
