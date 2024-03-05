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

<script>
import plural from 'plural-ru';
import { mapActions } from 'vuex';
import Rating from '@/components/common/Rating.vue';

export default {
    name: 'ComplexHoldingCompany',
    components: {
        Rating
    },
    props: {
        company: {
            type: Object
        }
    },
    data() {
        return {
            plural: plural,
            contacts: []
        };
    },
    methods: {
        ...mapActions({ fetchContacts: 'FETCH_COMPANY_CONTACTS' })
    },
    async mounted() {
        this.contacts = await this.fetchContacts(this.company.id);
    }
};
</script>
