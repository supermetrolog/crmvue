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
        <InProgress />
    </div>
</template>
<script setup>
import MessengerQuizHelperSection from '@/components/Messenger/Quiz/MessengerQuizHelperSection.vue';
import { shallowRef } from 'vue';
import InProgress from '@/components/common/InProgress.vue';

const sections = [
    {
        id: 1,
        title: 'Площадь. Продажа',
        questions: ['Есть ли сейчас площади на продажу?', 'Освободится ли в течении года?']
    }
];

const opened = shallowRef(false);

const toggle = () => {
    opened.value = !opened.value;
};

defineExpose({ toggle });
</script>
