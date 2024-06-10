<template>
    <div class="messenger-chat-message" :class="classList">
        <Avatar v-if="!self" :src="message.from.model.userProfile.avatar" size="55" />
        <div class="messenger-chat-message__content hover-actions-trigger">
            <MessengerChatMessageActions
                @pin="pinMessage"
                @edit="editMessage"
                @pin-to-object="pinToObject"
                :message="message"
                :pinned="pinned"
            />
            <MessengerChatMessageAdditions v-if="additions" :additions="additions" />
            <div
                v-if="message.message"
                class="messenger-chat-message__body"
                v-html="message.message"
            ></div>
            <AnimationTransition>
                <MessengerChatMessageAttachments
                    v-if="message.attachments?.length"
                    :files="message.attachments"
                />
            </AnimationTransition>
            <div class="messenger-chat-message__footer">
                <span>{{ username }}, </span>
                <span v-tippy="originalDate" class="messenger-chat-message__date">
                    {{ formattedDate }},
                </span>
                <span v-if="message.contacts.length">
                    с
                    <a
                        @click.prevent="changeRecipient"
                        href="#"
                        class="messenger-chat-message__recipient"
                    >
                        {{ recipientUsername }}
                    </a>
                </span>
                <span v-else>без звонка</span>
                <template v-if="message.tags.length">
                    <span>, </span>
                    <span class="messenger-chat-message__categories">
                        {{ categories }}
                    </span>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { entityOptions } from '@/const/options/options';
import Avatar from '@/components/common/Avatar.vue';
import MessengerChatMessageActions from '@/components/Messenger/Chat/Message/MessengerChatMessageActions.vue';
import MessengerChatMessageAdditions from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditions.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerChatMessageAttachments from '@/components/Messenger/Chat/Message/MessengerChatMessageAttachments.vue';

export default {
    name: 'MessengerChatMessage',
    components: {
        MessengerChatMessageAttachments,
        AnimationTransition,
        MessengerChatMessageAdditions,
        MessengerChatMessageActions,
        Avatar
    },
    inject: ['$messageUpdate'],
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
        },
        pinned: {
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
            return this.message.tags
                .map(element => this.$formatter.text().ucFirst(element.name))
                .join(', ');
        },
        recipientUsername() {
            const contact = this.message.contacts[0];

            if (contact.type === entityOptions.contact.typeStatement.GENERAL)
                return 'Общий контакт';

            return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
        },
        additions() {
            return {
                tasks: this.message.tasks,
                alerts: this.message.alerts,
                reminders: this.message.reminders
            };
        }
    },
    methods: {
        ...mapMutations({ setCurrentRecipient: 'Messenger/setCurrentRecipient' }),
        changeRecipient() {
            this.setCurrentRecipient({ contactID: this.message.contacts[0].id });
            this.$toast(`Контакт изменен на ${this.recipientUsername}`);
        },
        async pinMessage() {
            if (this.pinned) {
                const unpinned = await this.$store.dispatch('Messenger/unpinMessage');
                if (unpinned) this.$toast('Сообщение успешно откреплено');
            } else {
                const pinned = await this.$store.dispatch('Messenger/pinMessage', this.message);
                if (pinned) this.$toast('Сообщение успешно закреплено');
            }
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
