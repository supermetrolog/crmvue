<template>
    <div>
        <p class="text-grey fs-2">{{ label }}</p>
        <VueEditor
            v-model="model"
            :min-height="50"
            :max-height="150"
            :toolbar="false"
            class="w-100"
            autofocus
        />
        <div class="d-flex gap-2 mt-1">
            <UiButton
                @click="$emit('confirm', model)"
                small
                icon="fa-solid fa-check"
                color="success-light"
                class="fs-2"
            >
                Сохранить
            </UiButton>
            <UiButton
                @click="$emit('cancel')"
                small
                icon="fa-solid fa-ban"
                color="light"
                class="fs-2"
            >
                Отмена
            </UiButton>
            <UiButton
                v-if="deletable"
                @click="$emit('delete')"
                small
                icon="fa-solid fa-trash"
                color="light"
                class="fs-2"
            >
                Удалить
            </UiButton>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const model = defineModel();

defineEmits(['delete', 'confirm', 'cancel']);
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    deletable: Boolean,
    message: String
});

onBeforeMount(() => {
    model.value = props.message;
});
</script>
