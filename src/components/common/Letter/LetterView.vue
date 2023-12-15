<template>
    <div class="letter-view">
        <div class="letter-view-info">
            <KeyValue>
                <Key> От:</Key>
                <Value>
                    <p class="letter-contact-value letter-from">
                        {{ letter.user.userProfile.short_name }}
                        <span class="letter-c-value">{{ letter.sender_email }}</span>
                    </p>
                </Value>
                <Key> Кому:</Key>
                <Value>
                    <p
                        v-for="lEmail in letter.letterEmails"
                        :key="lEmail.id"
                        class="letter-contact-value letter-target"
                    >
                        <template v-if="lEmail.contact">
                            {{ lEmail.contact.first_and_last_name }}
                        </template>
                        <span class="letter-c-value">{{ lEmail.email }}</span>
                    </p>
                    <p
                        v-for="lPhone in letter.letterPhones"
                        :key="lPhone.id"
                        class="letter-contact-value letter-target"
                    >
                        <template v-if="lPhone.contact">
                            {{ lPhone.contact.first_and_last_name }}
                        </template>
                        <span class="letter-c-value">{{ lPhone.phone }}</span>
                    </p>
                </Value>
                <Key> Способ:</Key>
                <Value>
                    <i
                        v-for="lWay in letter.letterWays"
                        :key="lWay.id"
                        :title="getWayByIndex(lWay.way).name"
                        :class="[getWayByIndex(lWay.way).icon, 'letter-way']"
                    ></i>
                </Value>
                <Key> Метод:</Key>
                <Value>
                    <span v-if="letter.shipping_method" class="letter-shipping-method success"> CRM </span>
                    <span v-else class="letter-shipping-method dark">Другими методами</span>
                </Value>
                <Key> Компания:</Key>
                <Value>
                    <a class="letter-company" :href="'companies/' + letter.company_id" target="_blank">{{
                        letter.company.full_name
                    }}</a>
                </Value>
                <template v-if="letter.shipping_method">
                    <Key> Тема:</Key>
                    <Value>
                        <p class="letter-subject" v-html="letter.subject"></p>
                    </Value>
                    <Key> Контент:</Key>
                    <Value>
                        <p class="letter-content" v-html="letter.body"></p>
                    </Value>
                </template>
            </KeyValue>
        </div>
        <div class="letter-view-offers mt-3">
            <div class="objects">
                <CompanyObjectsList :objects="getOffers()" :disabled="true" col="col-3" />
            </div>
        </div>
    </div>
</template>

<script>
import Key from '@/components/common/KeyValue/Key.vue';
import Value from '@/components/common/KeyValue/Value.vue';
import KeyValue from '@/components/common/KeyValue/KeyValue.vue';
import { WayOfSending } from '@/const/const';
import CompanyObjectsList from '@/components/Company/Object/CompanyObjectList.vue';

export default {
    name: 'LetterView',
    components: {
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
    methods: {
        getWayByIndex(index) {
            let options = WayOfSending.get('param');
            return options[index][1];
        },
        getOffers() {
            return this.letter.letterOffers.map(item => {
                if (item.offer && item.offer.id) {
                    return item.offer;
                } else {
                    return { ...item, noOffer: true };
                }
            });
        }
    }
};
</script>

<style></style>