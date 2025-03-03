<template>
    <div class="messenger-quiz__question messenger-quiz-question">
        <Checkbox v-model="modelValue" class="messenger-quiz__related">
            <div class="messenger-quiz__related-text">
                <span>Заполнить по всем объектам собственника</span>
                <i
                    v-tippy="
                        'Для каждого объекта собственника будет создан опросник и соответствующие задачи при необходимости.'
                    "
                    class="fa-regular fa-question-circle fs-4"
                />
            </div>
        </Checkbox>
    </div>
</template>
<script setup>
import Checkbox from '@/components/common/Forms/Checkbox.vue';

const modelValue = defineModel();
</script>
