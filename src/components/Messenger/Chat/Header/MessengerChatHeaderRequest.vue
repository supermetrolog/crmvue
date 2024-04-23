<template>
    <div class="messenger-chat-header-request">
        <div class="messenger-chat-header__description">
            <p class="messenger-chat-header__title">
                <span>Запрос от Компании #{{ dialog.model.company_id }}</span>
                <span class="messenger-chat-header__id"> , ID{{ dialog.model.id }} </span>
            </p>
            <p class="messenger-chat-header__deals">
                <i v-if="isActive" class="fa-solid fa-up-long"></i>
                <span v-if="dealType" class="messenger-dialog-request__type">{{ dealType }}</span>
                <span v-if="dialog.model.minArea || dialog.model.maxArea">
                    <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                        {{
                            $formatter.numberOrRangeNew(dialog.model.minArea, dialog.model.maxArea)
                        }}
                    </with-unit-type>
                </span>
            </p>
            <p>{{ messagesCount }}</p>
        </div>
    </div>
</template>
<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { entityOptions } from '@/const/options/options.js';
import { unitTypes } from '@/const/unitTypes.js';
import plural from 'plural-ru';

export default {
    name: 'MessengerChatHeaderRequest',
    components: { WithUnitType },
    props: {
        dialog: {
            type: Object,
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        dealType() {
            return entityOptions.deal.type[this.dialog.model.dealType + 1];
        },
        isActive() {
            return this.dialog.model.status === entityOptions.request.statusStatement.ACTIVE;
        },
        messagesCount() {
            const count = this.$store.state.Messenger.messagesPagination.totalCount;
            return plural(count, '%d сообщение', '%d сообщения', '%d сообщений');
        }
    }
};
</script>
