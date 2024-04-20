<template>
    <div class="messenger-chat-label">
        {{ formattedDate }}
    </div>
</template>
<script>
export default {
    name: 'MessengerChatLabel',
    props: {
        date: {
            type: Object,
            required: true
        }
    },
    computed: {
        formattedDate() {
            if (this.date.isToday()) return 'Сегодня';
            if (this.date.isYesterday()) return 'Вчера';

            if (this.date.isSame(Date.now(), 'year')) return this.date.format('D MMMM');

            return this.date.format('DD.MM.YYYY');
        }
    }
};
</script>
