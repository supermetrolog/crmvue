<template>
    <div class="messenger-quiz__disabled">
        <Modal
            show
            :blackout-opacity="0"
            :width="500"
            hide-header
            body-class="messenger-quiz__unavailable-body"
        >
            <div class="d-flex gap-4 align-items-center">
                <i class="fa-solid fa-phone-volume icon" />
                <p class="fs-3">
                    Для заполнения вопросов укажите, удалось ли дозвониться до клиента.
                </p>
            </div>
        </Modal>
    </div>
</template>
<script setup>
import Modal from '@/components/common/Modal.vue';
defineEmits(['suggest-contact']);
</script>
