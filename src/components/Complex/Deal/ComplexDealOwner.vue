<template>
    <div class="object-holding-company">
        <p class="object-holding-company__title">Информация о компании</p>
        <div class="object-holding-company__header">
            <router-link
                v-tippy="owner.description"
                class="object-holding-company__name"
                :to="'/companies/' + owner.id"
                target="_blank"
            >
                {{ owner.full_name }}
            </router-link>
            <p class="object-holding-company__message">
                <span>{{ contactsLabel }}, </span>
                <span>{{ requestsLabel }}, </span>
                <span>{{ objectsLabel }}</span>
            </p>
        </div>
        <div v-if="owner.rating" class="object-holding-company__rating">
            <Rating :rating="owner.rating" />
        </div>
        <p class="object-holding-company__subtitle">Основной контакт:</p>
        <ComplexDealOwnerContact v-if="owner.mainContact" :contact="owner.mainContact" />
        <p v-else>Отсутсвует</p>
        <DashboardChip
            @click="isOpenListContact = !isOpenListContact"
            class="dashboard-bg-success-l object-holding-company__button"
        >
            Полный список контактов ({{ contacts.length }})
            <i v-if="isOpenListContact" class="fa-solid fa-caret-up"></i>
            <i v-else class="fa-solid fa-caret-down"></i>
        </DashboardChip>
        <DropdownContainer v-model="isOpenListContact" class="object-holding-company__list">
            <ComplexDealOwnerContact
                v-for="contact in contacts"
                :key="contact.id"
                :contact="contact"
            />
            <p v-if="!contacts.length">Список контактов пуст..</p>
        </DropdownContainer>
    </div>
</template>

<script setup>
import { plural } from '@/utils/plural.js';
import DropdownContainer from '@/components/common/Dropdown/DropdownContainer.vue';
import ComplexDealOwnerContact from '@/components/Complex/Deal/ComplexDealOwnerContact.vue';
import { useStore } from 'vuex';
import Rating from '@/components/common/Rating.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    owner: {
        type: Object,
        required: true
    }
});

const contacts = ref([]);

const isOpenListContact = ref(false);

const store = useStore();

onMounted(async () => {
    contacts.value = await store.dispatch('FETCH_COMPANY_CONTACTS', props.owner.id);
});

const contactsLabel = computed(() =>
    plural(contacts.value.length, '%d контакт', '%d контакта', '%d контактов')
);

const requestsLabel = computed(() =>
    plural(props.owner.requests_count, '%d запрос', '%d запроса', '%d запросов')
);

const objectsLabel = computed(() =>
    plural(props.owner.objects_count, '%d объект', '%d объекта', '%d объектов')
);
</script>
