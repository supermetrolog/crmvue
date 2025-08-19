<template>
    <div class="task-card-relation-survey">
        <div class="task-card-relation-survey__content">
            <Avatar :src="survey.user.userProfile.avatar" :size="30" />
            <span class="font-weight-semi">Опрос #{{ survey.id }}</span>
        </div>
        <div class="task-card-relation-survey__actions">
            <UiButtonIcon
                @click="$emit('unlink')"
                label="Удалить связь"
                icon="fa-solid fa-link-slash"
                small
            />
        </div>
    </div>
</template>
<script setup>
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import Avatar from '@/components/common/Avatar.vue';

defineEmits(['unlink']);

defineProps({
    survey: {
        type: Object,
        required: true
    }
});
</script>
