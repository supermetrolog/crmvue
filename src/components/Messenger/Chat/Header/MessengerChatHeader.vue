<template>
    <div class="messenger-chat-header">
        <div class="messenger-chat-header__body">
            <component :is="componentName" :dialog="currentDialog" />
        </div>
        <div class="messenger-chat-header__functions">
            <router-link
                v-if="currentDialog.model_type === 'object' && linkToObject"
                v-tippy="'Открыть на сайте'"
                :to="linkToObject"
                target="_blank"
                class="messenger-chat-header__function rounded-icon"
            >
                <i class="fa-solid fa-up-right-from-square"></i>
            </router-link>
            <button
                v-tippy="'Открыть панель чата'"
                @click="$toggleSettings"
                class="messenger-chat-header__function rounded-icon"
            >
                <i class="fa-solid fa-table-columns"></i>
            </button>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import MessengerChatHeaderObject from '@/components/Messenger/Chat/Header/MessengerChatHeaderObject.vue';
import MessengerChatHeaderRequest from '@/components/Messenger/Chat/Header/MessengerChatHeaderRequest.vue';

export default {
    name: 'MessengerChatHeader',
    components: { MessengerChatHeaderObject, MessengerChatHeaderRequest },
    inject: ['$toggleSettings'],
    computed: {
        ...mapState({ currentDialog: state => state.Messenger.currentDialog }),
        componentName() {
            return (
                'MessengerChatHeader' +
                this.$formatter.text().ucFirst(this.currentDialog.model_type)
            );
        },
        linkToObject() {
            if (this.currentDialog.model.object.complex_id)
                return '/complex/' + this.currentDialog.model.object.complex_id;

            return null;
        }
    }
};
</script>
