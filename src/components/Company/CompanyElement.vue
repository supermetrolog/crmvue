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
                    :to="'/companies/' + company.id"
                    target="_blank"
                >
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
            <span>
                {{ plural(contactsLength, '%d контакт', '%d контакта', '%d контактов') }},
            </span>
            <span>
                {{ plural(company.requests_count, '%d запрос', '%d запроса', '%d запросов') }},
            </span>
            <span>
                {{ plural(company.objects_count, '%d объект', '%d объекта', '%d объектов') }}
            </span>
        </p>
    </div>
</template>
<script setup>
import Rating from '@/components/common/Rating.vue';
import plural from 'plural-ru';
import { entityOptions } from '@/const/options/options.js';
import { computed } from 'vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const contactsLength = computed(() => {
    if (Object.hasOwn(props.company, 'contacts')) {
        if (!props.company.contacts?.length) return 0;

        return props.company.contacts.reduce(
            (acc, contact) => acc + contact.type === entityOptions.contact.typeStatement.PERSONAL,
            0
        );
    } else {
        return props.company.contacts_count;
    }
});

const companyName = computed(() => getCompanyName(props.company));
</script>
