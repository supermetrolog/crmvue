<template>
    <div v-if="opened" class="messenger-quiz-helper">
        <div class="messenger-quiz-helper__header">
            <p>Помощь по вопросам клиентам</p>
            <i @click="toggle" class="fa-regular fa-circle-xmark"></i>
        </div>
        <div class="messenger-quiz-helper__sections">
            <MessengerQuizHelperSection
                v-for="section in sections"
                :key="section.id"
                :section="section"
            />
        </div>
    </div>
</template>
<script>
import MessengerQuizHelperSection from '@/components/Messenger/Quiz/MessengerQuizHelperSection.vue';

export default {
    name: 'MessengerQuizHelper',
    components: { MessengerQuizHelperSection },
    data() {
        return {
            opened: false,
            sections: [
                {
                    id: 1,
                    title: 'Площадь. Продажа',
                    questions: [
                        'Есть ли сейчас площади на продажу? Есть ли сейчас площади на продажу? Есть ли сейчас площади на продажу? Есть ли сейчас площади на продажу?',
                        'Освободится ли в течении года?'
                    ]
                },
                {
                    id: 2,
                    title: 'Площадь. Продажа',
                    questions: [
                        'Есть ли сейчас площади на продажу?',
                        'Освободится ли в течении года?'
                    ]
                },
                {
                    id: 3,
                    title: 'Площадь. Продажа',
                    questions: [
                        'Есть ли сейчас площади на продажу?',
                        'Освободится ли в течении года?'
                    ]
                },
                {
                    id: 4,
                    title: 'Площадь. Продажа',
                    questions: [
                        'Есть ли сейчас площади на продажу?',
                        'Освободится ли в течении года?'
                    ]
                }
            ]
        };
    },
    methods: {
        toggle() {
            this.opened = !this.opened;
        }
    }
};
</script>
