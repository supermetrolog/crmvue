<template>
    <div class="messenger-quiz-question-call__description">
        <span v-if="isLoading" class="skeleton">
            Последний звонок 11.11.1111. Всего звонков 1111
        </span>
        <div v-else>
            <i>
                <span>{{ callsCountLabel }}</span>
                <span v-if="contact.calls?.length"> Последний звонок {{ lastCallDate }} </span>
            </i>
            <p v-if="lastThreeCallsIsUnavailable" class="text-danger">
                <i>Не удалось дозвониться уже более 3х раз подряд!</i>
            </p>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { plural } from '@/utils/plural.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const callsCountLabel = computed(() => {
    if (props.contact.calls?.length > 0) {
        return `Всего ${plural(props.contact.calls.length, '%d звонок', '%d звонка', '%d звонков')}.`;
    }

    return 'Нет звонков';
});

const lastCallDate = computed(() => {
    return toBeautifulDateFormat(props.contact.calls[0].created_at);
});

const lastThreeCallsIsUnavailable = computed(() => {
    if (props.contact.calls.length >= 3) {
        return props.contact.calls.slice(0, 3).every(element => element.status === 0);
    }

    return false;
});
</script>
