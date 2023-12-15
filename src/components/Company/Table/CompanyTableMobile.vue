<template>
    <ul class="company-table-view">
        <Loader v-if="loader" class="center" />
        <li v-for="company in companies" :key="company.id" class="CompanyViewItem p-2 mb-3">
            <div class="text-center p-0"></div>
            <div class="name" sort="nameRu">
                <router-link :to="'/companies/' + company.id" target="_blank">
                    <h4 class="d-inline" :class="{ 'text-warning': !company.status }">
                        #{{ company.id }} - {{ company.full_name }}
                    </h4>
                    <Progress :percent="company.progress_percent" />
                </router-link>
            </div>
            <div class="text-center requests">
                <div class="scroller">
                    <div>
                        <span
                            v-for="request in company.requests"
                            :key="request.id"
                            class="badge badge-blue-green autosize d-block"
                        >
                            {{ request.format_name }}
                        </span>
                        <p v-if="!company.requests.length">&#8212;</p>
                    </div>
                </div>
            </div>
            <div class="container row">
                <div class="text-center text-vertical-align-center categories col-6">
                    <div v-if="company.categories.length" class="d-inline-block">
                        <span
                            v-for="categoryItem of company.categories"
                            :key="categoryItem.id"
                            class="badge autosize p-0 mx-1 d-inline-block"
                        >
                            {{ category(categoryItem.category) }}
                        </span>
                    </div>
                    <p v-else>&#8212;</p>
                </div>
                <div class="text-center contacts col-6">
                    <template v-if="company.mainContact">
                        <p v-if="!company.mainContact.phones.length && !company.mainContact.emails.length">&#8212;</p>
                        <p class="name">{{ company.mainContact.first_and_last_name }}</p>
                        <p
                            v-if="
                                company.mainContact &&
                                !company.mainContact.position_unknown &&
                                positionOptions.find(item => item.value == company.mainContact.position)
                            "
                            class="position"
                        >
                            {{ positionOptions.find(item => item.value == company.mainContact.position).label }}
                        </p>
                        <a
                            v-for="email of company.mainContact.emails"
                            :key="email.email"
                            :href="'mailto:' + email.email"
                            class="d-block"
                        >
                            {{ email.email }}
                        </a>
                        <PhoneNumber
                            v-for="phone of company.mainContact.phones"
                            :key="phone.id"
                            :phone="phone"
                            :contact="company.mainContact"
                        />
                    </template>
                    <p v-else>&#8212;</p>
                </div>
            </div>
            <div>
                <span>Консультант - </span><span>{{ company.consultant.userProfile.short_name }}</span>
            </div>
            <div class="date" sort="created_at">
                {{ company.created_at_format }}
            </div>
        </li>
    </ul>
</template>

<script>
import { MixinCompanyView } from '@/components/Company/mixins.js';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'CompanyTableMobile',
    components: { Loader },
    mixins: [MixinCompanyView]
};
</script>