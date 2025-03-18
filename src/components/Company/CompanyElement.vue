<template>
    <div class="company-element">
        <div class="company-element__main">
            <CompanyLogo
                :company-id="company.id"
                :company-name="companyName"
                :src="company.logo"
                :size="42"
            />
            <div class="company-element__body">
                <router-link
                    class="company-element__name"
                    :to="{ name: 'company', params: { id: company.id } }"
                    target="_blank"
                >
                    <i
                        v-if="isWithoutActiveContacts"
                        v-tippy="'Компания без контактов'"
                        class="fa-solid fa-users-slash mr-1"
                    />
                    <i
                        v-if="company.is_individual"
                        v-tippy="'Физ.лицо'"
                        class="fa-solid fa-user-tie mr-1"
                    ></i>
                    <span :class="{ 'error-message': company.noName }">{{ companyName }}</span>
                </router-link>
                <div v-if="company.rating" class="company-element__rating">
                    <Rating :rating="company.rating" />
                </div>
            </div>
        </div>
        <p class="company-element__info">
            <span>{{ pluralContactsCount }}, </span>
            <span>{{ pluralRequestsCount }}, </span>
            <span>{{ pluralObjectsCount }}</span>
        </p>
    </div>
</template>
<script setup>
import Rating from '@/components/common/Rating.vue';
import { plural } from '@/utils/plural.js';
import { computed } from 'vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const companyName = computed(() => getCompanyName(props.company));
const isWithoutActiveContacts = computed(() => props.company.active_contacts_count === 0);

const pluralContactsCount = computed(() =>
    plural(props.company.active_contacts_count, '%d контакт', '%d контакта', '%d контактов')
);

const pluralRequestsCount = computed(() =>
    plural(props.company.requests_count, '%d запрос', '%d запроса', '%d запросов')
);

const pluralObjectsCount = computed(() =>
    plural(props.company.objects_count, '%d объект', '%d объекта', '%d объектов')
);
</script>
