<template>
    <div class="messenger-quiz-preview-info">
        <DashboardCard class="dashboard-bg-light mb-3">
            <div class="messenger-quiz-preview-info__content">
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
                    <span>{{ createdAt }}</span>
                    <span
                        v-if="quiz.created_at !== quiz.updated_at"
                        v-tippy="`Редактирован - ${updatedAt}`"
                        class="fs-1 ml-1 text-grey"
                    >
                        (ред.)
                    </span>
                </DashboardChip>
                <UiButtonIcon
                    v-if="editable && canBeEdit"
                    @click="$emit('edit')"
                    small
                    icon="fa-solid fa-pen"
                    :label="editButtonLabel"
                    class="dashboard-bg-gray-l"
                />
            </div>
        </DashboardCard>
    </div>
</template>
<script setup>
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { computed, toRef } from 'vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import Avatar from '@/components/common/Avatar.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';

defineEmits(['edit']);
const props = defineProps({
    quiz: {
        type: Object,
        required: true
    },
    editable: {
        type: Boolean,
        default: true
    }
});

const createdAt = computed(() => toBeautifulDateFormat(props.quiz.created_at));
const updatedAt = computed(() => toBeautifulDateFormat(props.quiz.updated_at));

const { canBeEdit, remainingTimeLabel } = useSurveyEditing(toRef(props, 'quiz'));

const editButtonLabel = computed(() => {
    if (remainingTimeLabel.value) return `Редактировать (осталось ${remainingTimeLabel.value})`;
    return 'Редактировать';
});
</script>
