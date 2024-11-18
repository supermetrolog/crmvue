<template>
    <div class="form-modal-task-description">
        <component :is="currentTemplate" :info />
    </div>
</template>
<script setup>
import { messenger } from '@/const/messenger.js';
import FormModalTaskDescriptionCompany from '@/components/Forms/FormModalTaskDescriptionCompany.vue';
import FormModalTaskDescriptionObject from '@/components/Forms/FormModalTaskDescriptionObject.vue';
import { computed } from 'vue';

const TEMPLATES = {
    [messenger.dialogTypes.COMPANY]: FormModalTaskDescriptionCompany,
    [messenger.dialogTypes.OBJECT]: FormModalTaskDescriptionObject
};

const props = defineProps({
    template: {
        type: String,
        required: true
    },
    info: {
        type: Object,
        default: () => ({})
    }
});

const currentTemplate = computed(() => TEMPLATES[props.template]);
</script>
