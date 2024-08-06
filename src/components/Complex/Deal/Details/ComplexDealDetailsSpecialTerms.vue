<template>
    <div class="additional-details__specials">
        <p class="additional-details__category">Особые условия</p>
        <ul class="additional-details__list">
            <li v-for="(term, key) in terms" :key="key" class="additional-details__item">
                <p class="additional-details__label">{{ term.label }}</p>
                <p
                    v-if="term.property === entityOptions.defaults.booleanStatement.TRUE"
                    class="additional-details__value"
                >
                    <span>Да</span>
                    <span v-if="term.value">, {{ term.value }} мес.</span>
                </p>
                <p v-else class="additional-details__value">Нет</p>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { entityOptions } from '@/const/options/options';

defineProps({
    terms: {
        type: Array,
        required: true
    }
});
</script>
