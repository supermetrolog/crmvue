<template>
    <TaskCardModal
        v-if="visible"
        @close="$emit('close')"
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
    </TaskCardModal>
</template>

<script setup>
import Spinner from '@/components/common/Spinner.vue';
import { ref, shallowRef, watch } from 'vue';
import api from '@/api/api.js';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import TaskCardModal from '@/components/TaskCard/TaskCardModal.vue';

const props = defineProps({
    companyId: {
        type: Number,
        required: true
    },
    visible: {
        type: Boolean,
        default: false
    }
});

const isLoading = ref(true);
const isError = ref(false);
const contacts = shallowRef([]);

const fetchContacts = async () => {
    isLoading.value = true;

    const response = await api.contacts.getByCompany(props.companyId);
    if (response) contacts.value = response;
    else isError.value = true;

    isLoading.value = false;
};

watch(
    () => props.visible,
    () => {
        if (props.visible && !contacts.value.length) fetchContacts();
    }
);
</script>
