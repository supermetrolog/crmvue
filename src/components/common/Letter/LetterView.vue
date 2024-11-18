<template>
    <div class="letter-view">
        <KeyValue>
            <Key>От:</Key>
            <Value>
                <DashboardChip class="dashboard-bg-success-l">
                    {{ letter.user.userProfile.short_name }},
                    <span class="letter-view__link">{{ letter.sender_email }}</span>
                </DashboardChip>
            </Value>
            <Key>Кому:</Key>
            <Value>
                <div class="d-flex flex-wrap gap-1">
                    <DashboardChip
                        v-for="lEmail in letter.letterEmails"
                        :key="lEmail.id"
                        class="dashboard-bg-primary-l"
                    >
                        <template v-if="lEmail.contact">
                            {{ lEmail.contact.first_and_last_name }},
                        </template>
                        <span class="letter-view__link">{{ lEmail.email }}</span>
                    </DashboardChip>
                    <DashboardChip
                        v-for="lPhone in letter.letterPhones"
                        :key="lPhone.id"
                        class="dashboard-bg-primary-l"
                    >
                        <template v-if="lPhone.contact">
                            {{ lPhone.contact.first_and_last_name }}
                        </template>
                        <span class="letter-view__link">{{ lPhone.phone }}</span>
                    </DashboardChip>
                </div>
            </Value>
            <Key>Способ:</Key>
            <Value>
                <div class="d-flex flex-wrap gap-1">
                    <DashboardChip
                        v-for="(way, key) in letterWays"
                        :key="key"
                        class="dashboard-bg-gray-l"
                    >
                        <div class="d-flex align-items-center gap-1">
                            <span>{{ way.name }}</span>
                            <i class="icon" :class="way.icon" />
                        </div>
                    </DashboardChip>
                </div>
            </Value>
            <Key>Метод:</Key>
            <Value>
                <DashboardChip
                    v-if="letter.shipping_method"
                    class="dashboard-bg-success dashboard-cl-white"
                >
                    CRM
                </DashboardChip>
                <DashboardChip v-else class="dashboard-bg-danger-l">
                    Другими методами
                </DashboardChip>
            </Value>
            <Key>Компания:</Key>
            <Value>
                <a class="text-primary" :href="$url.company(letter.company_id)" target="_blank">
                    {{ letter.company.full_name }}
                </a>
            </Value>
            <template v-if="letter.shipping_method">
                <Key>Тема:</Key>
                <Value>
                    <p v-html="letter.subject"></p>
                </Value>
                <Key>Контент:</Key>
                <Value>
                    <p v-html="letter.body"></p>
                </Value>
            </template>
        </KeyValue>
        <div class="objects mt-2">
            <CompanyObjectsList label="test" :objects="offers" disabled col="col-4" />
        </div>
    </div>
</template>

<script>
import Key from '@/components/common/KeyValue/Key.vue';
import Value from '@/components/common/KeyValue/Value.vue';
import KeyValue from '@/components/common/KeyValue/KeyValue.vue';
import { WayOfSending } from '@/const/const';
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

export default {
    name: 'LetterView',
    components: {
        DashboardChip,
        CompanyObjectsList,
        Key,
        Value,
        KeyValue
    },
    props: {
        letter: {
            type: Object,
            required: true
        }
    },
    computed: {
        letterWays() {
            return this.letter.letterWays.map(element => WayOfSending[element.way]);
        },
        offers() {
            return this.letter.letterOffers.map(item => {
                if (item.offer?.id) return item.offer;
                else return { ...item, noOffer: true };
            });
        }
    }
};
</script>
