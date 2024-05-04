<template>
    <Tr class="CompanyTableItem" :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd }">
        <Td class="text-center">
            {{ company.id }}
        </Td>
        <Td class="name column" sort="nameRu">
            <router-link :to="'/companies/' + company.id" target="_blank">
                <h4 class="d-inline" :class="{ 'text-warning': !company.status }">
                    {{ company.full_name }}
                </h4>
            </router-link>
            <span v-if="company.activityProfile !== null" class="name-type">{{
                activityProfileOptions[company.activityProfile].label
            }}</span>
            <div>
                <i
                    v-for="rating in ratingOptions"
                    :key="rating[0]"
                    class="text-warning far fa-star"
                    :class="{
                        'fas fa-star': company.rating >= rating[0]
                    }"
                >
                </i>
            </div>
        </Td>
        <Td class="text-center categories">
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
        </Td>
        <Td class="text-center contacts">
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
        </Td>
        <Td class="text-center"><span></span></Td>
        <Td class="text-center CompanyTableItem-consultant">
            {{ company.consultant.userProfile.short_name }}
        </Td>
        <Td class="CompanyTableItem-notif text-warning"
            ><span v-if="false">Пора позвонить клиенту</span></Td
        >
        <Td class="text-center date" sort="created_at">
            {{ formattedDate }}
        </Td>
    </Tr>
    <CompanyTableDropdown
        v-if="isThereDropdown"
        @clickTimeline="clickTimeline"
        :odd="odd"
        :active-requests="activeRequests"
        :archive-requests="archiveRequests"
        :objects="company.objects"
    />
</template>

<script>
import CompanyTableDropdown from '@/components/Company/Table/CompanyTableDropdown.vue';
import { MixinCompanyView } from '@/components/Company/mixins.js';
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import { mapGetters } from 'vuex';
import { ActivityProfileList } from '@/const/const.js';
import dayjs from 'dayjs';

export default {
    name: 'CompanyTableItem',
    components: {
        Tr,
        Td,
        CompanyTableDropdown
    },
    mixins: [MixinCompanyView],
    props: {
        company: {
            type: Object,
            default: () => {}
        },
        odd: Boolean
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        activityProfileOptions: () => ActivityProfileList,
        activeRequests() {
            return this.company.requests.filter(request => request.status === 1);
        },
        archiveRequests() {
            return this.company.requests.filter(request => request.status === 2);
        },
        formattedDate() {
            return dayjs(this.company.created_at).format('DD.MM.YYYY');
        },
        isThereDropdown() {
            return (
                this.activeRequests.length ||
                this.archiveRequests.length ||
                this.company.objects.length
            );
        }
    },
    methods: {
        clickTimeline(request) {
            let route = this.$router.resolve({
                path: `/companies/${this.company.id}`,
                query: {
                    request_id: request.id,
                    consultant_id: this.THIS_USER.id,
                    step: 0
                }
            });
            window.open(route.href);
        }
    }
};
</script>
