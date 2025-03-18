<template>
    <UiModal
        v-model:visible="isVisible"
        @close="cancel"
        :width="550"
        custom-close
        class="confirm"
        title="Подтверждение действия"
        hide-header
    >
        <div class="confirm__content">
            <!--            <div class="confirm__icon">-->
            <!--                <i :class="content.icon" />-->
            <!--            </div>-->
            <div class="confirm__description">
                <p class="confirm__title">
                    {{ content.title }}
                </p>
                <p v-if="content.message" class="confirm__message">{{ content.message }}</p>
            </div>
        </div>
        <template #actions>
            <UiButton @click="submit" color="danger" :icon="content.okIcon" bolder>
                {{ content.okButton }}
            </UiButton>
            <UiButton @click="cancel" color="light" icon="fa-solid fa-ban" bolder>
                {{ content.cancelButton }}
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import { useConfirm } from '@/composables/useConfirm.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';

const { isVisible, content, cancel, submit } = useConfirm();
</script>
