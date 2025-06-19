<template>
    <div class="survey-form-object__content">
        <div class="survey-form-object__description">
            <p class="survey-form-object__new-label">
                <i class="fa-solid fa-lightbulb fs-3 mr-1"></i>
                <span>Создание нового объекта</span>
            </p>
            <p class="survey-form-object__address fs-2">
                <i class="fa-solid fa-earth mr-1" /><span class="fs-2">{{ object.address }}</span>
            </p>
        </div>
        <div class="d-flex gap-1 flex-wrap fs-2 font-weight-semi">
            <span>{{ object.is_land ? 'Участок' : 'Строение' }}</span>
            <span>|</span>
            <WithUnitType :value="object.area" :unit-type="unitTypes.SQUARE_METERS" />
            <template v-if="!object.is_land && object.class">
                <span>|</span>
                <span>{{ object.class }} класс</span>
            </template>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

defineProps({
    object: {
        type: Object,
        required: true
    }
});
</script>
