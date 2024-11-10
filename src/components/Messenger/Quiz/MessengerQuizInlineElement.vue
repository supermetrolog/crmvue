<template>
    <div class="messenger-quiz-inline-element">
        <i class="fa-solid fa-phone-volume messenger-quiz-inline-element__icon"></i>
        <Avatar :size="30" :src="quiz.user?.userProfile?.avatar" />
        <div class="messenger-quiz-inline-element__description">
            <span>{{ createdAt }}, </span>
            <span>{{ quiz.user.userProfile.medium_name }}</span>
            <i class="fa-solid fa-arrow-right-long mx-2"></i>
            <span>{{ contactName }}</span>
        </div>
        <HoverActionsButton
            @click="$emit('show')"
            label="Посмотреть сводку"
            class="messenger-quiz-inline-element__button ml-auto"
            small
        >
            <i class="fa-solid fa-eye"></i>
        </HoverActionsButton>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { getContactFullName, toDateFormat } from '@/utils/formatter.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

defineEmits(['show']);
const props = defineProps({
    quiz: {
        type: Object,
        required: true
    }
});

const createdAt = computed(() => toDateFormat(props.quiz.created_at, 'DD.MM.YY'));
const contactName = computed(() => getContactFullName(props.quiz.contact));
</script>
