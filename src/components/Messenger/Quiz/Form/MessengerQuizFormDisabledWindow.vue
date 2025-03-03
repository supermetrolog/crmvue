<template>
    <div class="messenger-quiz__disabled">
        <Modal
            show
            :blackout-opacity="0.1"
            :width="400"
            hide-header
            body-class="messenger-quiz__disabled-body"
        >
            <div class="text-center">
                <i class="fa-solid fa-users-slash icon mb-2" />
                <p class="fs-3">Отсутствуют активные контакты!</p>
            </div>
            <template #footer>
                <Button @click="$emit('suggest-contact')" small icon>
                    <i class="fa-solid fa-user-plus" />
                    <span>Добавить контакт</span>
                </Button>
            </template>
        </Modal>
    </div>
</template>
<script setup>
import Button from '@/components/common/Button.vue';
import Modal from '@/components/common/Modal.vue';
defineEmits(['suggest-contact']);
</script>
