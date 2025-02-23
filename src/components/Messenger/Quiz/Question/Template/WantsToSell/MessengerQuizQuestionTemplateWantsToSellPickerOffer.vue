<template>
    <MessengerQuizQuestionTemplateOffer
        @show-preview="$emit('show-preview')"
        :offer
        :class="{ disabled: disabled, active: active }"
    >
        <template v-if="editMode" #before>
            <RadioOptions
                v-model="modelValue.action"
                :options="options"
                show-radio
                :rounded="false"
                class="mb-1"
            />
        </template>
        <template v-if="passiveMode" #aside>
            <Checkbox v-if="passiveMode" :checked="active" />
        </template>
        <template v-if="commentIsVisible" #after>
            <Textarea
                v-if="commentIsVisible"
                v-model="modelValue.comment"
                :placeholder="commentPlaceholder"
                auto-height
                :min-height="50"
                :required="modelValue.action === 1"
            />
        </template>
    </MessengerQuizQuestionTemplateOffer>
</template>
<script setup>
import { computed } from 'vue';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MessengerQuizQuestionTemplateOffer from '@/components/Messenger/Quiz/Question/Template/Offer/MessengerQuizQuestionTemplateOffer.vue';

defineEmits(['show-preview']);
const modelValue = defineModel();
defineProps({
    offer: {
        type: Object,
        required: true
    },
    editMode: Boolean,
    passiveMode: Boolean,
    disabled: Boolean,
    active: Boolean
});

// options

const options = { 0: 'В пассив', 1: 'Редактировать', 2: 'Без изменений' };

const commentIsVisible = computed(() => {
    return modelValue.value.action === 0 || modelValue.value.action === 1;
});

const commentPlaceholder = computed(() => {
    if (modelValue.value.action === 0) return 'Комментарий..';
    if (modelValue.value.action === 1) return 'Опишите, что необходимо редактировать..';
    return null;
});
</script>
