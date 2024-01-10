<template>
    <div class="object-holding-company">
        <p class="object-holding-company__title">Информация о компании</p>
        <div class="object-holding-company__header">
            <router-link
                class="object-holding-company__name"
                :to="'/companies/' + company.id"
                target="_blank"
            >
                {{ company.full_name }}
            </router-link>
            <p class="object-holding-company__message">{{ contactsLength }}</p>
        </div>
        <div v-if="rating" class="object-holding-company__rating">
            <Rating :rating="rating" />
        </div>
        <p class="object-holding-company__subtitle">Основной контакт:</p>
        <ComplexHoldingCompanyContact v-if="company.mainContact" :contact="company.mainContact" />
        <p v-else>Отсутсвует</p>
        <p @click="isOpenListContact = !isOpenListContact" class="object-holding-company__subtitle">
            Полный список контактов:
            <i v-if="isOpenListContact" class="fa-solid fa-caret-up"></i>
            <i v-else class="fa-solid fa-caret-down"></i>
        </p>
        <DropdownContainer v-model="isOpenListContact" class="object-holding-company__list">
            <ComplexHoldingCompanyContact
                v-for="contact in contacts"
                :key="contact.id"
                :contact="contact"
            />
        </DropdownContainer>
    </div>
</template>

<script>
import plural from 'plural-ru';
import { mapActions } from 'vuex';
import DropdownContainer from '@/components/common/Dropdown/DropdownContainer.vue';
import Rating from '@/components/common/Rating.vue';
import ComplexHoldingCompanyContact from '@/components/Complex/Holding/ComplexHoldingCompanyContact.vue';

export default {
    name: 'ComplexHoldingCompany',
    components: {
        ComplexHoldingCompanyContact,
        Rating,
        DropdownContainer
    },
    props: {
        company: {
            type: Object
        }
    },
    data() {
        return {
            plural: plural,
            contacts: [],
            isOpenListContact: false,
            rating: 4
        };
    },
    computed: {
        contactsLength() {
            return plural(this.contacts.length, '%d контакт', '%d контакта', '%d контактов');
        }
    },
    methods: {
        ...mapActions({ fetchContacts: 'FETCH_COMPANY_CONTACTS' })
    },
    async mounted() {
        this.contacts = await this.fetchContacts(this.company.id);
    }
};
</script>
