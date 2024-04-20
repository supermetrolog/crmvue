<template>
    <div class="messenger-chat-form-contact">
        <div class="messenger-chat-form-contact__icon rounded-icon">
            <i v-if="contact.isMain" class="fa-solid fa-crown"></i>
            <i v-else class="fa-solid fa-phone"></i>
        </div>
        <div class="messenger-chat-form-contact__description">
            <p class="messenger-chat-form-contact__username">
                {{ contact.full_name }}
            </p>
            <p class="messenger-chat-form-contact__staff">
                <span v-if="contact.position">
                    {{ position }}
                </span>
                <span v-else-if="contact.positionUnknown">Должность неизвестна..</span>
                <span v-else class="messenger-chat-form-contact__warning">
                    Должность не заполнена!
                </span>
            </p>
        </div>
        <i class="fa-solid fa-chevron-right messenger-chat-form-contact__chevron"></i>
    </div>
</template>
<script>
import { entityOptions } from '@/const/options/options';

export default {
    name: 'MessengerChatFormRecipientContact',
    props: {
        contact: {
            type: Object,
            required: true
        }
    },
    computed: {
        position() {
            return entityOptions.contact.position[this.contact.position];
        }
    }
};
</script>
