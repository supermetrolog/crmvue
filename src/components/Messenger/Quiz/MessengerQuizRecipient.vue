<template>
    <div class="messenger-quiz-recipient">
        <div class="messenger-quiz-recipient__info">
            <p class="messenger-quiz-recipient__username">
                <i
                    v-if="recipient.faceToFaceMeeting"
                    v-tippy="'Была личная (очная) встреча'"
                    class="fa-solid fa-street-view mr-1"
                />
                <i
                    v-if="recipient.good"
                    v-tippy="'Хорошие взаимоотношения'"
                    class="fa-regular fa-face-smile-beam mr-1"
                />
                <i
                    v-if="recipient.isMain"
                    v-tippy="'Основной контакт'"
                    class="fa-solid fa-crown mr-1"
                />
                <span>{{ recipient.full_name }}</span>
            </p>
            <p class="messenger-quiz-recipient__staff">
                <span v-if="recipient.position">
                    {{ position }}
                </span>
                <span v-else-if="recipient.position_unknown">Должность неизвестна..</span>
            </p>
            <p class="messenger-quiz-recipient__email">
                <template v-if="mainEmail">
                    <i v-tippy="'Основной Email'" class="fa-solid fa-crown mr-1"></i>
                    <span>{{ mainEmail.email }}</span>
                </template>
                <span v-else-if="recipient.emails?.length">
                    {{ recipient.emails[0].email }}
                </span>
                <span v-else>Email не заполнен!</span>
            </p>
            <div
                v-if="recipient.warning"
                v-tippy="recipient.warning_why_comment"
                class="messenger-quiz-recipient__warning"
            >
                <span>Внимание! {{ recipient.warning_why_comment }}</span>
            </div>
        </div>
        <div class="messenger-quiz-recipient__contacts">
            <p v-if="mainPhone">
                <i v-tippy="'Основной телефон'" class="fa-solid fa-crown mr-1"></i>
                <span class="messenger-quiz-recipient__phone">
                    {{ mainPhone.phone }}
                </span>
            </p>
            <p v-for="phone in phones" :key="phone.id" class="messenger-quiz-recipient__phone">
                {{ phone.phone }}
            </p>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';

const props = defineProps({
    recipient: {
        type: [Object, null],
        required: true
    }
});

const position = computed(() => contactOptions.position[props.recipient.position]);
const mainPhone = computed(() => {
    return props.recipient.phones.find(phone => phone.isMain);
});
const mainEmail = computed(() => {
    return props.recipient.emails.find(email => email.isMain);
});

const phones = computed(() => props.recipient.phones.filter(element => !element.isMain));
</script>
