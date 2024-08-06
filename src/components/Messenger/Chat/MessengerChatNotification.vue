<template>
    <div class="messenger-chat-message messenger-chat-message--system">
        <div class="messenger-chat-message__content">
            <div class="messenger-chat-message__body" v-html="message.text"></div>
            <div class="messenger-chat-message__footer">
                Системное уведомление,
                <span v-tippy="originalDate" class="messenger-chat-message__date">
                    {{ formattedDate }}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MessengerChatNotification',
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    computed: {
        originalDate() {
            return this.message.dayjs_date.format('D MMMM YYYY., H:mm:ss');
        },
        formattedDate() {
            return this.message.dayjs_date.format('H:mm');
        }
    }
};
</script>
