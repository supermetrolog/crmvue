<template>
    <Tippy v-if="validator.$errors.length" class="form__tooltip tooltip-validation">
        <template #default>
            <i class="fa-solid fa-circle-exclamation" />
        </template>
        <template #content>
            <p class="tooltip-validation__title">Полный список ошибок:</p>
            <ol class="tooltip-validation__list">
                <li
                    v-for="error in validator.$errors"
                    :key="error.$property"
                    class="tooltip-validation__message"
                >
                    {{ $formatter.text().ucFirst(error.$message) }}
                </li>
            </ol>
        </template>
    </Tippy>
    <div v-else>
        <div class="form__tooltip form__tooltip--success">
            <i class="fa-solid fa-circle-check"></i>
        </div>
    </div>
</template>
<script>
import { Tippy } from 'vue-tippy';

export default {
    name: 'ValidationInfo',
    components: { Tippy },
    props: {
        validator: {
            type: Object,
            required: true
        }
    }
};
</script>
