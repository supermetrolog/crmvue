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
                <i class="fa-solid fa-hand icon mb-2" />
                <p class="fs-3 mb-3">Сегодня опрос уже пройден!</p>
                <p>
                    <i class="fa-regular fa-clock mr-1" />
                    Заполнить новый можно через {{ remainingTimeLabel }}
                </p>
            </div>
            <template #footer>
                <Button @click="$emit('show')" small icon>
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>Просмотреть опрос</span>
                </Button>
            </template>
        </Modal>
    </div>
</template>
<script setup>
import Button from '@/components/common/Button.vue';
import { toRef } from 'vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import Modal from '@/components/common/Modal.vue';
defineEmits(['show']);
const props = defineProps({ lastSurvey: Object });

const { remainingTimeLabel } = useSurveyEditing(toRef(props, 'lastSurvey'));
</script>
