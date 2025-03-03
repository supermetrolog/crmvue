<template>
    <div class="messenger-quiz-question-template-offer">
        <div class="messenger-quiz-question-template-offer__body">
            <slot name="aside" />
            <MessengerQuizQuestionTemplateObjectPreview
                @show-preview="$emit('show-preview')"
                :object
            />
            <MessengerQuizQuestionTemplateObjectContent :object />
        </div>
        <div :class="{ 'ml-4': $slots.aside }">
            <slot name="after" />
        </div>
    </div>
</template>
<script setup>
import MessengerQuizQuestionTemplateObjectPreview from '@/components/Messenger/Quiz/Question/Template/Object/MessengerQuizQuestionTemplateObjectPreview.vue';
import MessengerQuizQuestionTemplateObjectContent from '@/components/Messenger/Quiz/Question/Template/Object/MessengerQuizQuestionTemplateObjectContent.vue';

defineEmits(['show-preview']);
defineProps({
    object: {
        type: Object,
        required: true
    }
});
</script>
