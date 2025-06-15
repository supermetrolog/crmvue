<template>
    <div v-if="editMode">
        <VueEditor
            v-model="localComment"
            :v
            :min-height="50"
            :max-height="150"
            :toolbar="false"
            placeholder="Что выяснили? Какое положение по компании? Опишите ситуацию.."
            class="w-100"
            autofocus
        />
        <div class="d-flex gap-2 mt-1">
            <UiButton
                @click="$emit('update', localComment)"
                mini
                icon="fa-solid fa-check"
                color="success-light"
            >
                Сохранить
            </UiButton>
            <UiButton @click="$emit('cancel')" mini icon="fa-solid fa-ban" color="light">
                Отмена
            </UiButton>
            <UiButton @click="$emit('delete')" mini icon="fa-solid fa-trash" color="light">
                Удалить
            </UiButton>
        </div>
    </div>
    <UiClamped v-else @expanded="$emit('expanded')" @hidden="$emit('hidden')" button-class="fs-2">
        <div ref="comment" class="company-table-item-survey__comment"></div>
    </UiClamped>
</template>

<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import { useLinkify } from '@/composables/useLinkify.js';
import UiClamped from '@/components/common/UiClamped.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['expanded', 'hidden', 'cancel', 'update', 'delete']);
const props = defineProps({
    survey: {
        type: Object,
        required: true
    },
    editMode: Boolean
});

useLinkify(
    computed(() => props.survey.comment),
    useTemplateRef('comment')
);

// edit

const localComment = ref(props.survey.comment);
</script>
