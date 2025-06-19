<template>
    <div class="survey-form-object survey-form-object--new">
        <div @click="$emit('select')" class="survey-form-object__body" :class="{ active }">
            <div class="survey-form-object__preview">
                <div class="offer-table-item-motion-slider">
                    <NoImage class="offer-table-item-motion-slider__main" />
                </div>
            </div>
            <SurveyFormNewObjectContent :object />
        </div>
        <div v-if="editable" class="survey-form-object__aside">
            <UiButtonIcon
                @click="$emit('edit')"
                small
                color="light"
                label="Редактировать"
                icon="fa-solid fa-pen"
            />
            <UiButtonIcon
                @click="$emit('delete')"
                small
                color="light"
                label="Удалить"
                icon="fa-solid fa-trash"
            />
        </div>
    </div>
</template>
<script setup>
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import NoImage from '@/components/common/NoImage.vue';
import SurveyFormNewObjectContent from '@/components/SurveyForm/Object/SurveyFormNewObjectContent.vue';

defineEmits(['delete', 'edit', 'select']);

defineProps({
    object: {
        type: Object,
        required: true
    },
    active: Boolean,
    editable: Boolean
});
</script>
