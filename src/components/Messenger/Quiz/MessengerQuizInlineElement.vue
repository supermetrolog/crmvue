<template>
    <div class="messenger-quiz-inline-element">
        <i class="fa-solid fa-exclamation-triangle messenger-quiz-inline-element__icon"></i>
        <Avatar :size="30" :src="quiz.user?.userProfile?.avatar" />
        <div class="messenger-quiz-inline-element__description">
            <span>{{ createdAt }}, </span>
            <span>{{ quiz.user.userProfile.medium_name }}</span>
            <i class="fa-solid fa-arrow-right-long mx-2"></i>
            <span>{{ contactName }}</span>
        </div>
        <Button @click="$emit('show')" class="ml-auto" small icon>
            <i class="fa-solid fa-eye"></i>
            <span>Посмотреть</span>
        </Button>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { getContactFullName, toDateFormat } from '@/utils/formatter.js';
import Button from '@/components/common/Button.vue';

defineEmits(['show']);
const props = defineProps({
    quiz: {
        type: Object,
        required: true
    }
});

const createdAt = computed(() => toDateFormat(props.quiz.created_at, 'D.MM.YYYY'));
const contactName = computed(() => getContactFullName(props.quiz.contact));
</script>
