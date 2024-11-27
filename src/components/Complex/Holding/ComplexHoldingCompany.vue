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
                {{ companyName }}
            </router-link>
            <p class="object-holding-company__message">
                <span>
                    {{ plural(contacts.length, '%d контакт', '%d контакта', '%d контактов') }},
                </span>
                <span>
                    {{ plural(company.requests_count, '%d запрос', '%d запроса', '%d запросов') }},
                </span>
                <span>
                    {{ plural(company.objects_count, '%d объект', '%d объекта', '%d объектов') }}
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
import { computed, onMounted, ref } from 'vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';

const store = useStore();

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const contacts = ref([]);

const companyName = computed(() => getCompanyName(props.company));

onMounted(async () => {
    contacts.value = await store.dispatch('FETCH_COMPANY_CONTACTS', props.company.id);
});
</script>
