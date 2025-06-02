<template>
    <div class="survey-form-calls">
        <div class="survey-form-calls__header mb-1">
            <div class="survey-form-calls__title">Контакты в опросе</div>
        </div>
        <div class="survey-form-calls__list">
            <SurveyFormContact
                v-for="contact in contacts"
                :key="contact.contact_id"
                @select="$emit('show-contact', contact.contact_id)"
                :model-value="contacts[contact.contact_id]"
                :contact="contact"
            />
            <EmptyData v-if="contactsIsEmpty">Список контактов в опросе пуст..</EmptyData>
        </div>
    </div>
</template>
<script setup>
import SurveyFormContact from '@/components/SurveyForm/SurveyFormContact.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed } from 'vue';

defineEmits(['show-contact']);
const props = defineProps({
    contacts: {
        type: Object,
        required: true
    }
});

const contactsIsEmpty = computed(() => Object.keys(props.contacts).length === 0);

// TODO: Заинжектить реальные контакты (если есть)
</script>
