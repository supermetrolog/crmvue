<template>
    <AnimationTransition :speed="0.4">
        <div v-if="isVisible" class="survey-form-warning-pending">
            <div>
                <p class="font-weight-semi fs-3">Этот опрос на паузе с {{ date }}</p>
                <p>Для разблокировки подтвердите продолжение опроса</p>
                <div class="d-flex gap-1 mt-2">
                    <UiButton
                        @click="continueSurvey"
                        :loading="isLoading"
                        small
                        color="success"
                        icon="fa-solid fa-play"
                    >
                        Продолжить
                    </UiButton>
                    <UiButton
                        @click="isVisible = false"
                        :disabled="isLoading"
                        small
                        color="light"
                        icon="fa-solid fa-ban"
                    >
                        Скрыть предупреждение
                    </UiButton>
                </div>
            </div>
        </div>
    </AnimationTransition>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed, ref } from 'vue';
import api from '@/api/api.js';
import { captureException } from '@sentry/vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useNotify } from '@/utils/use/useNotify.js';

const emit = defineEmits(['continue']);

const props = defineProps({ draft: Object });

const date = computed(() => toDateFormat(props.draft.updated_at, 'D.MM.YYг.'));

const isLoading = ref(false);

const notify = useNotify();

async function continueSurvey() {
    try {
        isLoading.value = true;

        await api.survey.continue(props.draft.id);

        emit('continue');
        notify.success('Опрос разблокирован', 'Работа с опросом');
    } catch (e) {
        captureException(e);
    } finally {
        isLoading.value = false;
    }
}

const isVisible = ref(true);
</script>
