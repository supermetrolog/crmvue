<template>
    <div class="messenger-chat-message" :class="classList">
        <Avatar v-if="!self" :src="message.from.model.userProfile.avatar" size="55" />
        <div class="messenger-chat-message__content hover-actions-trigger">
            <MessengerChatMessageActions
                @pin="pinMessage"
                @edit="editMessage"
                @pin-to-object="pinToObject"
                :message="message"
            />
            <MessengerChatMessageAdditions v-if="additions" :additions="additions" />
            <div
                v-if="message.message"
                class="messenger-chat-message__body"
                v-html="message.message"
            ></div>
            <!--            <AnimationTransition>-->
            <!--                <MessengerChatMessageAttachments-->
            <!--                    v-if="message.attachments?.length"-->
            <!--                    :files="message.attachments"-->
            <!--                />-->
            <!--            </AnimationTransition>-->
            <div class="messenger-chat-message__footer">
                <span>{{ username }}, </span>
                <span v-tippy="originalDate" class="messenger-chat-message__date">
                    {{ formattedDate }},
                </span>
                <!--                <span v-if="message.recipient">-->
                <!--                    с-->
                <!--                    <a-->
                <!--                        @click.prevent="changeRecipient"-->
                <!--                        href="#"-->
                <!--                        class="messenger-chat-message__recipient"-->
                <!--                    >-->
                <!--                        {{ recipientUsername }}-->
                <!--                    </a>-->
                <!--                </span>-->
                <span>без звонка</span>
                <!--                <template v-if="message.category">-->
                <!--                    <span>, </span>-->
                <!--                    <span class="messenger-chat-message__categories">-->
                <!--                        {{ categories }}-->
                <!--                    </span>-->
                <!--                </template>-->
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { messenger } from '@/const/messenger';
import { entityOptions } from '@/const/options/options';
import Avatar from '@/components/common/Avatar.vue';
import MessengerChatMessageActions from '@/components/Messenger/Chat/Message/MessengerChatMessageActions.vue';
import MessengerChatMessageAdditions from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditions.vue';

export default {
    name: 'MessengerChatMessage',
    components: {
        MessengerChatMessageAdditions,
        MessengerChatMessageActions,
        Avatar
    },
    inject: ['$openCreator', '$messageUpdate'],
    provide() {
        return {
            $messageID: this.message.id
        };
    },
    props: {
        message: {
            type: Object,
            required: true
        },
        self: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        originalDate() {
            return this.message.dayjs_date.format('D MMMM YYYY., H:mm:ss');
        },
        formattedDate() {
            return this.message.dayjs_date.format('H:mm');
        },
        classList() {
            return {
                'messenger-chat-message--right': this.self
            };
        },
        username() {
            let username = this.message.from.model.userProfile.middle_name;

            if (this.message.from.model.userProfile?.first_name)
                username += ` ${this.message.from.model.userProfile.first_name[0]}.`;
            if (this.message.from.model.userProfile?.last_name)
                username += ` ${this.message.from.model.userProfile.last_name[0]}.`;

            return username;
        },
        categories() {
            return messenger.categories[this.message.category];
        },
        recipientUsername() {
            if (this.message.recipient?.type === entityOptions.contact.typeStatement.GENERAL)
                return 'Общий контакт';

            return this.message.recipient?.first_and_last_name;
        },
        additions() {
            if (!this.message.tasks?.length) return null;

            return { tasks: this.message.tasks };
        }
    },
    methods: {
        ...mapMutations({ setCurrentRecipient: 'Messenger/setCurrentRecipient' }),
        changeRecipient() {
            this.setCurrentRecipient(this.message.recipient);
            this.$toast(`Контакт изменен на ${this.message.recipient?.full_name}`);
        },
        async pinMessage() {
            await this.$store.dispatch('Messenger/pinMessage', this.message.id);
            this.$toast(
                this.message.pinned
                    ? 'Сообщение успешно закреплено'
                    : 'Сообщение успешно откреплено'
            );
        },
        async editMessage() {
            const updated = await this.$messageUpdate(this.message);

            if (updated) {
                this.$toast('Сообщение успешно обновлена');
            }
        },
        async pinToObject() {
            const pinned = await this.$store.dispatch('Messenger/pinMessageToObject', this.message);

            if (pinned) {
                this.$toast(
                    this.message.pinnedToObject
                        ? 'Сообщение успешно закреплено за объектом'
                        : 'Сообщение успешно откреплено от объекта'
                );
            } else {
                this.$toast('Произошла ошибка. Попробуйте еще раз');
            }
        }
    }
};
</script>
