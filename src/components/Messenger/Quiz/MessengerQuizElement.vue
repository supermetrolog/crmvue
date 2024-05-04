<template>
    <div class="messenger-quiz-element">
        <Avatar :src="quiz.author?.avatar" />
        <div class="messenger-quiz-element__description">
            <p class="messenger-quiz-element__author">{{ quiz.author?.short_name }}</p>
            <p v-if="quiz.contact">Звонок с {{ quiz.contact }}</p>
            <p v-else>Без звонка</p>
        </div>
        <div class="messenger-quiz-element__meta">
            <p>{{ createdAt }}</p>
        </div>
    </div>
</template>
<script>
import Avatar from '@/components/common/Avatar.vue';
import dayjs from 'dayjs';
export default {
    name: 'MessengerQuizElement',
    components: { Avatar },
    props: {
        quiz: {
            type: Object,
            required: true
        }
    },
    computed: {
        createdAt() {
            return dayjs(this.quiz.created_at).format('DD.MM.YYYY, HH:mm');
        }
    }
};
</script>
