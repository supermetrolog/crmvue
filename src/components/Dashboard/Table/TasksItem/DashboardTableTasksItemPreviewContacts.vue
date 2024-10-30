<template>
    <div class="dashboard-task-item-preview-contacts">
        <Spinner v-if="isLoading" class="small" />
        <EmptyLabel v-else-if="isError">Произошла ошибка. Попробуйте позже</EmptyLabel>
        <EmptyLabel v-else-if="!contacts.length">Список контактов пуст..</EmptyLabel>
        <div v-show="!isLoading" class="dashboard-task-item-preview-contacts__list">
            <DashboardTableTasksItemPreviewContactsItem
                v-for="contact in contacts"
                :key="contact.id"
                :contact="contact"
            />
        </div>
    </div>
</template>

<script setup>
import Spinner from '@/components/common/Spinner.vue';
import { onMounted, ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import DashboardTableTasksItemPreviewContactsItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemPreviewContactsItem.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';

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

    const response = await api.contacts.getByCompany(props.companyId);
    if (response) contacts.value = response;
    else isError.value = true;

    isLoading.value = false;
};

onMounted(() => {
    fetchContacts();
});
</script>
