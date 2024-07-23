<template>
    <div class="company-element">
        <router-link class="company-element__name" :to="'/companies/' + company.id" target="_blank">
            <span v-if="!company.noName">{{ company.full_name }}</span>
            <span v-else>Компания #{{ company.id }}</span>
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
<script setup>
import Rating from '@/components/common/Rating.vue';
import plural from 'plural-ru';
import { entityOptions } from '@/const/options/options.js';
import { computed } from 'vue';

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const contactsLength = computed(() => {
    if (!props.company.contacts?.length) return 0;

    return props.company.contacts.reduce(
        (acc, contact) => acc + contact.type === entityOptions.contact.typeStatement.PERSONAL,
        0
    );
});
</script>
