<template>
    <div class="messenger-quiz-preview">
        <div class="messenger-quiz-preview__list">
            <MessengerQuizPreviewQuestion
                v-for="(question, key) in quiz.answers"
                :key="key"
                :question="question"
                class="messenger-quiz-preview__element"
            />
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs';
import MessengerQuizPreviewQuestion from '@/components/Messenger/Quiz/MessengerQuizPreviewQuestion.vue';

export default {
    name: 'MessengerQuizPreview',
    components: { MessengerQuizPreviewQuestion },
    props: {
        quiz: {
            type: Object,
            required: true
        }
    },
    computed: {
        recipient() {
            return this.quiz.contact ? `с ${this.quiz.contact}` : 'без звонка';
        },
        createdAt() {
            return dayjs(this.quiz.created_at).format('DD.MM.YYYY');
        }
    }
};
</script>
