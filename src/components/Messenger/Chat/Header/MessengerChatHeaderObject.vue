<template>
    <div class="messenger-chat-header-object">
        <div class="messenger-chat-header__preview">
            <img :src="dialog.model.object.thumb" alt="chat preview" />
        </div>
        <div class="messenger-chat-header__description">
            <p class="messenger-chat-header__title">
                <span>от Компании #{{ dialog.model.object.company_id }}</span>
                <span class="messenger-chat-header__id"> , ID{{ dialog.model.object.id }} </span>
            </p>
            <p class="messenger-chat-header__deals">{{ dealType }}</p>
            <p>{{ dialog.messages.length }} сообщений</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MessengerChatHeaderObject',
    props: {
        dialog: {
            type: Object,
            required: true
        }
    },
    computed: {
        dealType() {
            return this.dialog.model.type === 'rent_or_sale'
                ? 'Аренда | Продажа'
                : 'Ответ-хранение';
        }
    }
};
</script>
