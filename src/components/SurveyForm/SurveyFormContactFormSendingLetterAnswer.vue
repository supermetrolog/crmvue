<template>
    <div class="p-2 br-2 dashboard-bg-light">
        <p class="fs-2 mb-2">
            <span>{{ createdAt }}</span>
            <span class="mx-1 text-grey">-</span>
            <span>Способ связи: {{ typeLabel }}</span>
            <span class="mx-1 text-grey">-</span>
            <span>Зафиксировал: {{ answer.marked_by!.userProfile.medium_name }}</span>
        </p>
        <hr />
        <p class="font-weight-semi mb-1 fs-2">Комментарий брокера:</p>
        <div v-if="answer.comment" v-html="answer.comment"></div>
        <p v-else class="text-grey op-5">Отсутствует</p>
    </div>
</template>
<script setup lang="ts">
import { LetterContactAnswer } from '@/types/contact/contact';
import { toBeautifulDateFormat } from '@/utils/formatters/date';
import { computed } from 'vue';

const props = defineProps<{
    answer: LetterContactAnswer;
}>();

const createdAt = computed(() => toBeautifulDateFormat(props.answer.marked_at));

const typeLabel = computed(() => {
    if (props.answer.type === 'phone') return 'Обратный звонок';
    if (props.answer.type === 'email') return 'Ответ по Email';
    return 'Иное';
});
</script>
