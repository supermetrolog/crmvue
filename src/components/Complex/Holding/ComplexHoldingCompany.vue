<template>
    <div class="object-holding-company">
        <p class="object-holding-company__title">Информация о компании</p>
        <div class="object-holding-company__header">
            <router-link
                v-tippy="company.description"
                class="object-holding-company__name"
                :to="'/companies/' + company.id"
                target="_blank"
            >
                {{ company.full_name }}
            </router-link>
            <p class="object-holding-company__message">
                <span>
                    {{ plural(contacts.length, '%d контакт', '%d контакта', '%d контактов') }},
                </span>
                <span>
                    {{ plural(company.request_count, '%d запрос', '%d запроса', '%d запросов') }},
                </span>
                <span>
                    {{ plural(company.object_count, '%d объект', '%d объекта', '%d объектов') }}
                </span>
            </p>
        </div>
        <div v-if="company.rating" class="object-holding-company__rating">
            <Rating :rating="company.rating" />
        </div>
    </div>
</template>

<script setup>
import plural from 'plural-ru';
import { useStore } from 'vuex';
import Rating from '@/components/common/Rating.vue';
import { onMounted, ref } from 'vue';

const store = useStore();

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const contacts = ref([]);

onMounted(async () => {
    contacts.value = await store.dispatch('FETCH_COMPANY_CONTACTS', props.company.id);
});
</script>
