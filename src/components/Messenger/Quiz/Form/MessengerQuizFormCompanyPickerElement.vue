<template>
    <div class="messenger-quiz-form-company-picker-element">
        <i v-if="company.new" class="fa-solid fa-plus" />
        <span>{{ company.company_name }}</span>
        <template v-if="company.area">
            <i class="fa-solid fa-arrow-right"></i>
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                {{ company.area }}
            </WithUnitType>
        </template>
        <i
            v-tippy="'Удалить'"
            @click="$emit('delete')"
            class="messenger-quiz-form-company-picker-element__button fa-solid fa-xmark"
        />
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

defineEmits(['delete']);
defineProps({
    company: {
        type: Object,
        required: true
    }
});
</script>
