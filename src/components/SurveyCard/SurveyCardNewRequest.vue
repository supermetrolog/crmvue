<template>
    <div class="survey-card__new-request survey-card-custom-element">
        <p class="mb-1">
            <span class="dashboard-bg-light py-1 px-2 font-weight-semi">
                {{ dealType }}
            </span>
        </p>
        <div v-if="request.description" v-html="request.description"></div>
        <p v-else>Без описания</p>
        <div v-if="editable" class="survey-card-custom-element__actions">
            <UiButtonIcon
                @click="$emit('edit')"
                small
                icon="fa-solid fa-pen"
                label="Редактировать"
            />
            <UiButtonIcon @click="$emit('delete')" small icon="fa-solid fa-trash" label="Удалить" />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['edit', 'delete']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    editable: Boolean
});

const dealType = computed(() => dealOptions.type[props.request.deal_type]);
</script>
