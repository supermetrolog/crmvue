<template>
    <div class="messenger-quiz-inline-element">
        <UiButtonIcon
            @click="$emit('show')"
            label="Посмотреть сводку"
            small
            icon="fa-solid fa-eye"
            class="messenger-quiz-inline-element__button"
        />
        <Avatar :size="30" :src="quiz.user?.userProfile?.avatar" />
        <div class="messenger-quiz-inline-element__description">
            <span class="font-weight-semi">{{ createdAt }}, </span>
            <span>{{ quiz.user.userProfile.medium_name }}</span>
            <template v-if="quiz.contact">
                <i class="fa-solid fa-arrow-right-long mx-2"></i>
                <span>{{ contactName }}</span>
            </template>
        </div>
        <UiChip class="ml-auto">{{ fromNow }}</UiChip>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date.ts';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiChip from '@/components/common/UI/UiChip.vue';

defineEmits(['show']);
const props = defineProps({
    quiz: {
        type: Object,
        required: true
    }
});

const createdAt = computed(() => toDateFormat(props.quiz.created_at, 'DD.MM.YY'));
const contactName = computed(() => getContactFullName(props.quiz.contact));

const fromNow = computed(() => {
    return dayjsFromServer(props.quiz.created_at).fromNow();
});
</script>
