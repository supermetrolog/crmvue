<template>
  <div class="letter-view">
    <div class="letter-view-info">
      <KeyValue>
        <Key> От: </Key>
        <Value>
          <p class="letter-contact-value letter-from">
            {{ letter.user.userProfile.short_name }}
            <span class="letter-c-value">{{ letter.sender_email }}</span>
          </p>
        </Value>
        <Key> Кому: </Key>
        <Value>
          <p
            class="letter-contact-value letter-target"
            v-for="lEmail in letter.letterEmails"
            :key="lEmail.id"
          >
            {{ lEmail.email.contact.first_and_last_name }}
            <span class="letter-c-value">{{ lEmail.email.email }}</span>
          </p>
          <p
            class="letter-contact-value letter-target"
            v-for="lPhone in letter.letterPhones"
            :key="lPhone.id"
          >
            {{ lPhone.phone.contact.first_and_last_name }}
            <span class="letter-c-value">{{ lPhone.phone.phone }}</span>
          </p>
        </Value>
        <Key> Способ: </Key>
        <Value>
          <i
            v-for="lWay in letter.letterWays"
            :key="lWay.id"
            :title="getWayByIndex(lWay.way).name"
            :class="[getWayByIndex(lWay.way).icon, 'letter-way']"
          ></i>
        </Value>
        <Key> Метод: </Key>
        <Value>
          <span
            class="letter-shipping-method success"
            v-if="letter.shipping_method"
          >
            CRM
          </span>
          <span class="letter-shipping-method dark" v-else
            >Другими методами</span
          >
        </Value>
        <template v-if="letter.shipping_method">
          <Key> Тема: </Key>
          <Value>
            <p class="letter-subject" v-html="letter.subject"></p>
          </Value>
          <Key> Контент: </Key>
          <Value>
            <p class="letter-content" v-html="letter.body"></p>
          </Value>
        </template>
      </KeyValue>
    </div>
    <div class="letter-view-offers mt-3">
      <Objects>
        <ObjectsList :objects="getOffers()" :disabled="true" col="col-3" />
      </Objects>
    </div>
  </div>
</template>

<script>
import Mixin from "./mixin";
import Key from "@/components/common/keyvalue/Key";
import Value from "@/components/common/keyvalue/Value";
import KeyValue from "@/components/common/keyvalue/KeyValue";
import { WayOfSending } from "@/const/Const";
import Objects from "@/components/companies/objects/Objects.vue";
import ObjectsList from "@/components/companies/objects/ObjectsList.vue";
export default {
  name: "LetterView",
  components: {
    Key,
    Value,
    KeyValue,
    Objects,
    ObjectsList,
  },
  mixins: [Mixin],
  methods: {
    getWayByIndex(index) {
      let options = WayOfSending.get("param");
      return options[index][1];
    },
    getOffers() {
      return this.letter.letterOffers.map((item) => {
        if (item.offer && item.offer.id) {
          return item.offer;
        } else {
          return { ...item, noOffer: true };
        }
      });
    },
  },
};
</script>

<style>
</style>