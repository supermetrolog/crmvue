<template>
    <div class="messenger-quiz-preview-info">
        <DashboardCard class="dashboard-bg-light mb-3">
            <div class="messenger-quiz-preview-info__content">
                <DashboardChip class="dashboard-bg-gray-l">
                    {{ quiz.user.userProfile.medium_name }}
                </DashboardChip>
                <div class="messenger-quiz-preview-info__icon">
                    <i class="fa-solid fa-phone-volume" />
                </div>
                <DashboardChip class="dashboard-bg-gray-l">
                    {{ fullName }}
                </DashboardChip>
                <DashboardChip v-if="quiz.contact.position" class="dashboard-bg-gray-l">
                    {{ position }}
                </DashboardChip>
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
import { contactOptions } from '@/const/options/contact.options.js';

const props = defineProps({
    quiz: {
        type: Object,
        required: true
    }
});

const position = computed(() => contactOptions.position[props.quiz.contact.position]);

const fullName = computed(() => {
    if (props.quiz.contact.full_name) return props.quiz.contact.full_name;
    else if (props.quiz.contact.middle_name || props.quiz.contact.first_name)
        return `${props.quiz.contact.middle_name ?? ''} ${props.quiz.contact.first_name ?? ''}`;
    else if (props.quiz.contact.type === contactOptions.typeStatement.GENERAL)
        return 'Основной контакт';
    return 'Без имени';
});

const createdAt = computed(() => toDateFormat(props.quiz.created_at));
</script>
