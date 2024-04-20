<template>
    <div v-if="opened" class="messenger-quiz">
        <div class="messenger-quiz__header">
            <p>
                {{ THIS_USER.userProfile.full_name }}, {{ recipient }}, от
                {{ currentDate }}
            </p>
            <i @click="close" class="fa-regular fa-circle-xmark"></i>
        </div>
        <p @click="$toggleQuizHelper" class="messenger-quiz__action">
            <i class="fa-solid fa-chevron-left"></i>
            <span>Отрыть список возможных вопросов клиенту</span>
        </p>
        <div class="messenger-quiz__content">
            <MessengerQuizQuestion
                v-for="question in questions"
                :key="question.id"
                :question="question"
                class="messenger-quiz__question"
            />
        </div>
        <div class="messenger-quiz__footer">
            <MessengerButton @click="send" color="success"> Готово </MessengerButton>
            <MessengerButton @click="openSchedule" :disabled="!currentRecipient">
                Запланировать звонок
            </MessengerButton>
            <MessengerButton
                @click="reportContact({ contact: currentRecipient })"
                :disabled="!currentRecipient || currentRecipient.not_actual"
            >
                Контакт не актуален
            </MessengerButton>
            <MessengerButton @click="breakObject" color="danger">Снесен</MessengerButton>
        </div>
    </div>
</template>
<script>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/MessengerQuizQuestion.vue';
import { questions } from '@/const/quiz';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import dayjs from 'dayjs';

export default {
    name: 'MessengerQuiz',
    components: { MessengerButton, MessengerQuizQuestion },
    inject: ['$openSchedule', '$toggleQuizHelper'],
    data() {
        return {
            opened: false
        };
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        ...mapState({ currentRecipient: state => state.Messenger.currentRecipient }),
        questions() {
            return questions.rent;
        },
        currentDate() {
            return dayjs().format('DD.MM.YYYY');
        },
        recipient() {
            if (this.currentRecipient) return `с ${this.currentRecipient.full_name}`;
            return 'без звонка';
        }
    },
    methods: {
        ...mapActions({ reportContact: 'Messenger/reportContact' }),
        async openSchedule() {
            const schedule = await this.$openSchedule();

            if (schedule) {
                this.$store.dispatch('Messenger/addCall', {
                    date: schedule,
                    contact: this.currentRecipient
                });
                this.$toast('Дата следующего звонка успешно выбрана');
            }
        },
        open() {
            this.opened = true;
        },
        close() {
            this.opened = false;
        },
        toggle() {
            this.opened = !this.opened;
        },
        async send() {
            const quizSent = await this.$store.dispatch('Messenger/sendQuiz', {
                contact: this.currentRecipient
            });

            if (quizSent) {
                this.close();
                this.$toast('Опросник успешно завершен.');
            }
        },
        async breakObject() {
            const requestSent = await this.$store.dispatch('Messenger/sendBreakObject');

            if (requestSent) {
                this.$toast('Объект помечен снесенным.');
            }
        }
    }
};
</script>
