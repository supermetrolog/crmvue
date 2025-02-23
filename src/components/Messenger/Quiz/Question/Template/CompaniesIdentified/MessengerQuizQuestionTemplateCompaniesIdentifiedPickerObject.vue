<template>
    <MessengerQuizQuestionTemplateObject
        @show-preview="$emit('show-preview')"
        :object
        :class="{ disabled: disabled }"
    >
        <template #after>
            <MessengerQuizFormCompanyPicker
                v-model="modelValue"
                :disabled="disabled"
                class="my-2"
            />
        </template>
    </MessengerQuizQuestionTemplateObject>
</template>
<script setup>
import MessengerQuizQuestionTemplateObject from '@/components/Messenger/Quiz/Question/Template/Object/MessengerQuizQuestionTemplateObject.vue';
import MessengerQuizFormCompanyPicker from '@/components/Messenger/Quiz/Form/MessengerQuizFormCompanyPicker.vue';

defineEmits(['show-preview']);
const modelValue = defineModel();
defineProps({
    object: {
        type: Object,
        required: true
    },
    disabled: Boolean
});
</script>
