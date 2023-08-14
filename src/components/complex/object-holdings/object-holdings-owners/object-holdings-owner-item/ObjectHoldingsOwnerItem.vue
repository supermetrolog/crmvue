
<!-- КОМПОНЕНТ С КОНТАКТАМИ ВЛАДЕЛЬЦА ОБЪЕКТА -->

<template>
  <div class="ObjectHoldingsOwnerItem">
    <span class="ObjectHoldingsOwnerItem-header">Собственник {{ index }}</span>
    <span class="ObjectHoldingsOwnerItem-name">{{ owner.name }}</span>
    <span class="ObjectHoldingsOwnerItem-mainContactPhones">{{ owner.mainContactPhones }}</span>
    <span class="ObjectHoldingsOwnerItem-mainContactPhones">{{ owner.mainContactEmails }}</span>
    <!-- 
    <span class=""> {{ objects.company.mainContact.phones }}</span>
    <span class="">{{ objects.company.mainContact.emails }}</span>
    <span class=""> {{ objects.commercialOffers.companyRecord.mainContact.phones}}</span>
    <span class="">{{objects.commercialOffers.companyRecord.mainContact.emails}}</span>
   -->
  
    
    <div class="ObjectHoldingsOwnerItem-rating">
      <rating :rating="owner.rating" />
    </div>
    <div class="ObjectHoldingsOwnerItem-links">
      <span
        >{{
          plural(
            owner.contacts.length,
            "%d контакт",
            "%d контакта",
            "%d контактов"
          )
        }},
      </span>
      <span
        >{{
          plural(
            owner.requests.length,
            "%d запрос",
            "%d запроса",
            "%d запросов"
          )
        }},
      </span>
      <span>{{
        plural(owner.objects.length, "%d объект", "%d объекта", "%d объектов")
      }}</span>
    </div>
  </div>
</template>

<script>
import plural from "plural-ru";
import "./styles.scss";
import Rating from "@/components/common/rating/Rating.vue";
export default {
  name: "ObjectHoldingsOwnerItem",
  components: {
    Rating,
  },
  props: {
    owner: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      plural: plural,
    };
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
