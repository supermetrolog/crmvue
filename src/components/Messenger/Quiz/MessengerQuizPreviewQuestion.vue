<template>
    <div class="messenger-quiz-question">
        <div class="messenger-quiz-question__header">
            <i
                v-if="hasFullAnswer"
                class="fa-solid fa-circle-check color-success animate__animated animate__tada"
            ></i>
            <i
                v-else-if="question.answer !== null"
                class="fa-solid fa-circle-exclamation color-warning animate__animated animate__pulse"
            ></i>
            <i
                v-else
                class="fa-solid fa-circle-exclamation color-danger animate__animated animate__flash"
            ></i>
            <p class="messenger-quiz-question__title">
                {{ question.question }}
            </p>
            <Chip v-if="question.answer !== null" :html="question.answer ? 'Да' : 'Нет'" />
            <p v-else>Без ответа</p>
        </div>
        <div v-if="question.additions?.length" class="messenger-quiz-question__additions">
            <Chip v-for="(addition, key) in question.additions" :key="key" :html="addition" />
        </div>
        <Textarea
            v-if="question.description"
            disabled
            :model-value="question.description"
            class="messenger-quiz-question__field"
            auto-height
        />
        <div v-if="question.interests?.length" class="messenger-quiz-question__interests">
            <Chip v-for="(interest, key) in question.interests" :key="key" :html="interest" />
        </div>
    </div>
</template>
<script>
import Textarea from '@/components/common/Forms/Textarea.vue';
import Chip from '@/components/common/Chip.vue';

export default {
    name: 'MessengerQuizPreviewQuestion',
    components: { Chip, Textarea },
    props: {
        question: {
            type: Object,
            required: true
        }
    },
    computed: {
        hasFullAnswer() {
            return (
                this.question.answer !== null &&
                this.question.description?.length &&
                this.question.additions?.length
            );
        }
    }
};
</script>
