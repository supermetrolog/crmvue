<template>
    <router-link
        :to="'/complex/' + dialog.model.object.complex_id"
        target="_blank"
        class="messenger-chat-header-object"
    >
        <div class="messenger-chat-header__preview">
            <VLazyImage :src="dialog.model.object.thumb" alt="chat preview" />
        </div>
        <div class="messenger-chat-header__description">
            <p class="messenger-chat-header__title">
                <span>от {{ companyName }}</span>
                <span class="messenger-chat-header__id"> , ID{{ dialog.model.object.id }} </span>
            </p>
            <p class="messenger-chat-header__deals">{{ dealType }}</p>
            <p>{{ messagesCount }}</p>
        </div>
    </router-link>
</template>
<script>
import VLazyImage from 'v-lazy-image';
import { alg } from '@/utils/alg.js';
import { entityOptions } from '@/const/options/options.js';
import plural from 'plural-ru';
export default {
    name: 'MessengerChatHeaderObject',
    components: { VLazyImage },
    props: {
        dialog: {
            type: Object,
            required: true
        }
    },
    computed: {
        dealType() {
            return entityOptions.object.dealTypeString[this.dialog.model.type];
        },
        companyName() {
            if (!this.dialog.model.object.company)
                return 'компании #' + this.dialog.model.object.company_id;

            if (alg.isNumeric(this.dialog.model.object.company.nameRu))
                return 'Компания #' + this.dialog.model.object.company.nameRu;

            return this.dialog.model.object.company.nameRu;
        },
        messagesCount() {
            const count = this.$store.state.Messenger.messagesPagination.totalCount;
            return plural(count, '%d сообщение', '%d сообщения', '%d сообщений');
        }
    }
};
</script>
