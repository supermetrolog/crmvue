<template>
    <div class="messenger-quiz-preview-info">
        <DashboardCard class="dashboard-bg-light mb-3">
            <div class="messenger-quiz-preview-info__content">
                <DashboardChip class="dashboard-bg-success-l">
                    {{ groupName }}
                </DashboardChip>
                <DashboardChip class="dashboard-bg-gray-l">
                    <div class="d-flex gap-1">
                        <Avatar :src="quiz.user.userProfile.avatar" :size="20" />
                        <span>{{ quiz.user.userProfile.medium_name }}</span>
                    </div>
                </DashboardChip>
                <div class="messenger-quiz-preview-info__icon">
                    <i class="fa-solid fa-phone-volume" />
                </div>
                <Tippy
                    max-width="400"
                    interactive
                    content-class="messenger-quiz-preview-info__contact"
                    placement="bottom"
                >
                    <template #default>
                        <DashboardChip class="dashboard-bg-gray-l" with-icon>
                            <span>{{ quiz.contact.full_name }}</span>
                            <i class="fa-regular fa-question-circle" />
                        </DashboardChip>
                    </template>
                    <template #content>
                        <ContactCard :contact="quiz.contact" />
                    </template>
                </Tippy>
                <DashboardChip class="ml-auto dashboard-bg-gray-l">
                    {{ createdAt }}
                </DashboardChip>
            </div>
        </DashboardCard>
    </div>
</template>
<script setup>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatter.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { quizQuestionsGroupsLabel } from '@/const/quiz.js';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import Avatar from '@/components/common/Avatar.vue';

const props = defineProps({
    quiz: {
        type: Object,
        required: true
    }
});

const groupName = computed(() => {
    if (props.quiz.questions.length) {
        return quizQuestionsGroupsLabel[props.quiz.questions[0].group];
    }

    return 'Без группы';
});

const createdAt = computed(() => toDateFormat(props.quiz.created_at));
</script>
