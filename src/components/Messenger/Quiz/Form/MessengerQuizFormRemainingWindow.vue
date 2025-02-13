<template>
    <div class="messenger-quiz__disabled">
        <DashboardChip class="dashboard-bg-primary" with-icon>
            <i class="fa-regular fa-clock" />
            <span>Заполнить новый опрос возможно только через {{ remainingTimeLabel }}</span>
        </DashboardChip>
        <Button @click="$emit('edit')" small icon class="dashboard-bg-primary">
            <i class="fa-solid fa-user-plus" />
            <span>Редактировать прошлый опрос</span>
        </Button>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Button from '@/components/common/Button.vue';
import { toRef } from 'vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
defineEmits(['edit']);
const props = defineProps({ lastSurvey: Object });

const { remainingTimeLabel } = useSurveyEditing(toRef(props, 'lastSurvey'));
</script>
