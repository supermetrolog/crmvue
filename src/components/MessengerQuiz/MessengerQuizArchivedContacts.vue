<template>
    <div>
        <Spinner v-if="isLoading" class="absolute-center" label="Загрузка контактов.." />
        <div v-else-if="contacts.length" class="row">
            <div v-for="contact in contacts" :key="contact.id" class="col-4">
                <MessengerQuizContact
                    @edit="$emit('edit', contact)"
                    class="h-100"
                    :contact="contact"
                />
            </div>
        </div>
        <EmptyData v-else>Список архивных контактов пуст..</EmptyData>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import MessengerQuizContact from '@/components/MessengerQuiz/MessengerQuizContact.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';

defineEmits(['edit']);
const props = defineProps({
    companyId: {
        type: Number,
        required: true
    }
});

// contacts

const isLoading = ref(true);
const contacts = ref([]);

async function fetchContacts() {
    isLoading.value = true;

    const response = await api.contacts.list({ company_id: props.companyId, status: 0, type: 0 });
    if (response) contacts.value = response.data;

    isLoading.value = false;
}

onMounted(fetchContacts);
</script>
