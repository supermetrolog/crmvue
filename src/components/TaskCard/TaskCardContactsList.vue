<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        relative
        :width="550"
        small
        :title="`Список контактов (${contacts.length})`"
    >
        <div class="task-card-contacts">
            <Spinner v-if="isLoading" label="Загрузка контактов.." class="small absolute-center" />
            <EmptyLabel v-else-if="isError">Произошла ошибка. Попробуйте позже</EmptyLabel>
            <EmptyLabel v-else-if="!contacts.length">Список контактов пуст..</EmptyLabel>
            <div v-show="!isLoading" class="task-card-contacts__list">
                <ContactCard
                    v-for="contact in contacts"
                    :key="contact.id"
                    class="task-card-contacts__element"
                    :contact="contact"
                />
            </div>
        </div>
        <template #actions="{ close }">
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" small> Закрыть </UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import Spinner from '@/components/common/Spinner.vue';
import { onBeforeMount, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const props = defineProps({
    companyId: {
        type: Number,
        required: true
    }
});

const isLoading = ref(true);
const isError = ref(false);
const contacts = shallowRef([]);

const fetchContacts = async () => {
    isLoading.value = true;

    try {
        const response = await api.contacts.getByCompany(props.companyId);
        if (response) contacts.value = response;
    } catch (error) {
        isError.value = true;
    } finally {
        isLoading.value = false;
    }
};

onBeforeMount(fetchContacts);
</script>
