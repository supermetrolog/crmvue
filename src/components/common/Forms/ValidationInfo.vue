<template>
    <Tippy
        v-if="errors.length || (validator && validator.$errors.length)"
        class="form__tooltip tooltip-validation"
    >
        <template #default>
            <i class="fa-solid fa-circle-exclamation" />
        </template>
        <template #content>
            <p class="tooltip-validation__title">Полный список ошибок:</p>
            <ol class="tooltip-validation__list">
                <template v-if="validator">
                    <li
                        v-for="error in validator.$errors"
                        :key="error.$property"
                        class="tooltip-validation__message"
                    >
                        {{ $formatter.text().ucFirst(error.$message) }}
                    </li>
                </template>
                <template v-else>
                    <li
                        v-for="(error, index) in errors"
                        :key="index"
                        class="tooltip-validation__message"
                    >
                        {{ $formatter.text().ucFirst(error.message) }}
                    </li>
                </template>
            </ol>
        </template>
    </Tippy>
    <div v-else>
        <div class="form__tooltip form__tooltip--success">
            <i class="fa-solid fa-circle-check"></i>
        </div>
    </div>
</template>
<script setup>
import { Tippy } from 'vue-tippy';

defineProps({
    validator: {
        type: Object,
        default: null
    },
    errors: {
        type: Array,
        default: () => []
    }
});
</script>
