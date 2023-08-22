
<!-- КОМПОНЕНТ С КОНТАКТАМИ ВЛАДЕЛЬЦА ОБЪЕКТА -->

<template>
  <div class="ObjectHoldingsOwnerItem">
	<span class="ObjectHoldingsOwnerItem-name">{{ company.full_name }}</span>
	<span class="ObjectHoldingsOwnerItem-name">{{ company.mainContact.full_name }}</span>
    <span class="ObjectHoldingsOwnerItem-mainContactPhones">{{ company.mainContact.phones.map((el) => el.phone).join(',') }}</span>
    <span class="ObjectHoldingsOwnerItem-mainContactPhones">{{ company.mainContact.emails.map((el) => el.email).join(',')  }}</span>
    <!-- 
    <span class=""> {{ objects.company.mainContact.phones }}</span>
    <span class="">{{ objects.company.mainContact.emails }}</span>
    <span class=""> {{ objects.commercialOffers.companyRecord.mainContact.phones}}</span>
    <span class="">{{objects.commercialOffers.companyRecord.mainContact.emails}}</span>
   -->
  
<!--     Это еще не реализовано!     -->


<!--    <div class="ObjectHoldingsOwnerItem-rating" v-if="false">-->
<!--      <rating :rating="owner.rating" />-->
<!--    </div>-->
<!--    <div class="ObjectHoldingsOwnerItem-links" v-if="false">-->
<!--      <span-->
<!--        >{{-->
<!--          plural(-->
<!--            owner.contacts.length,-->
<!--            "%d контакт",-->
<!--            "%d контакта",-->
<!--            "%d контактов"-->
<!--          )-->
<!--        }},-->
<!--      </span>-->
<!--      <span-->
<!--        >{{-->
<!--          plural(-->
<!--            owner.requests.length,-->
<!--            "%d запрос",-->
<!--            "%d запроса",-->
<!--            "%d запросов"-->
<!--          )-->
<!--        }},-->
<!--      </span>-->
<!--      <span>{{-->
<!--        plural(owner.objects.length, "%d объект", "%d объекта", "%d объектов")-->
<!--      }}</span>-->
<!--    </div>-->
  </div>
</template>

<script lang="ts">
import plural from "plural-ru";
import "./styles.scss";
// import Rating from "@/components/common/rating/Rating.vue";
import {PropType} from "vue";
import {CompanyEntity} from "@/entities/company.entity";

export default {
  name: "ObjectHoldingsOwnerItem",
  components: {
    // Rating,
  },
  props: {
	company: {
	  type: Object as PropType<CompanyEntity>,
    }
  },
  data() {
    return {
      plural: plural,
    };
  },
};
</script>

<style lang="scss" scoped></style>
