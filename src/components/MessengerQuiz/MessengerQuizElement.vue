<template>
    <div class="messenger-quiz-element">
        <Avatar :src="quiz.user?.userProfile?.avatar" />
        <div class="messenger-quiz-element__description">
            <p class="messenger-quiz-element__author">{{ quiz.user?.short_name }}</p>
            <p v-if="quiz.contact">Звонок с {{ contactName }}</p>
            <p v-else>Без звонка</p>
        </div>
        <div class="messenger-quiz-element__meta">
            <p>{{ createdAt }}</p>
        </div>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { toDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    quiz: {
        type: Object,
        required: true
    }
});

const createdAt = computed(() => toDateFormat(props.quiz.created_at));
const contactName = computed(() => getContactFullName(props.quiz.contact));
</script>
