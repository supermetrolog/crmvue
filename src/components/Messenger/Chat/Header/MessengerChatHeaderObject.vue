<template>
    <div class="messenger-chat-header-object">
        <div class="messenger-chat-header__preview">
            <VLazyImage :src="dialog.model.object.thumb" alt="chat preview" />
        </div>
        <div class="messenger-chat-header__description">
            <p class="messenger-chat-header__title">
                <span>
                    от {{ $formatter.companyName(company, dialog.model.object.company_id) }}
                </span>
                <span class="messenger-chat-header__id">, ID{{ dialog.model.object.id }}</span>
            </p>
            <p class="messenger-chat-header__deals">{{ dealType }}</p>
        </div>
    </div>
</template>
<script>
import VLazyImage from 'v-lazy-image';
import { entityOptions } from '@/const/options/options.js';
import { mapState } from 'vuex';

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
        ...mapState({ company: state => state.Messenger.currentPanel }),
        dealType() {
            return entityOptions.object.dealTypeString[this.dialog.model.type];
        }
    }
};
</script>
