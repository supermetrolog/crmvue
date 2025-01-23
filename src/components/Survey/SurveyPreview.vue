<template>
    <Modal @close="cancel" :show="isVisible" title="Просмотр опросника" width="970">
        <div class="survey-preview">
            <MessengerQuizPreview :quiz-id="quizId" />
        </div>
    </Modal>
</template>
<script setup>
import { onUnmounted, ref } from 'vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizPreview from '@/components/Messenger/Quiz/Preview/MessengerQuizPreview.vue';

const quizId = ref(null);

const {
    isVisible,
    onPopupShowed,
    destroy: destroyPopup,
    cancel,
    props
} = useAsyncPopup('surveyPreview');

onPopupShowed(() => {
    quizId.value = props.value.surveyId;
});

onUnmounted(() => {
    destroyPopup();
});
</script>
