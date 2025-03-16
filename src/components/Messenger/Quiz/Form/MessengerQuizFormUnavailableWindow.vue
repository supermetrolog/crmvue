<template>
    <div class="messenger-quiz__disabled">
        <UiModal
            show
            custom-close
            :blackout-opacity="0.1"
            :width="520"
            hide-header
            body-class="messenger-quiz__disabled-body"
            title="Опрос заблокирован"
        >
            <div class="d-flex align-items-center justify-content-center gap-3">
                <i class="fa-solid fa-phone-volume icon" />
                <div>
                    <p class="fs-3 mb-2 font-weight-semi">Созвонитесь с клиентом!</p>
                    <p>Для заполнения вопросов укажите, удалось ли дозвониться до клиента.</p>
                </div>
            </div>
            <template #actions>
                <UiButton
                    @click="$emit('show-call-question')"
                    class="font-weight-bold"
                    icon="fa-solid fa-up-right-from-square"
                    color="light"
                    uppercase
                    center
                >
                    Перейти к вопросу
                </UiButton>
            </template>
        </UiModal>
    </div>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';

defineEmits(['show-call-question']);
</script>
