<template>
    <div class="company-element">
        <router-link class="company-element__name" :to="'/companies/' + company.id" target="_blank">
            {{ company.full_name }}
        </router-link>
        <div v-if="company.rating" class="company-element__rating">
            <Rating :rating="company.rating" />
        </div>
        <p class="company-element__info">
            <span>
                {{ plural(contactsLength, '%d контакт', '%d контакта', '%d контактов') }},
            </span>
            <span>
                {{ plural(company.request_count, '%d запрос', '%d запроса', '%d запросов') }},
            </span>
            <span>
                {{ plural(company.object_count, '%d объект', '%d объекта', '%d объектов') }}
            </span>
        </p>
    </div>
</template>
<script>
import Rating from '@/components/common/Rating.vue';
import plural from 'plural-ru';
import { entityOptions } from '@/const/options/options.js';

export default {
    name: 'CompanyElement',
    components: { Rating },
    props: {
        company: {
            type: Object,
            required: true
        }
    },
    computed: {
        contactsLength() {
            if (!this.company.contacts?.length) return 0;

            return this.company.contacts.reduce(
                (acc, contact) =>
                    (acc += contact.type === entityOptions.contact.typeStatement.PERSONAL),
                0
            );
        }
    },
    methods: { plural }
};
</script>
