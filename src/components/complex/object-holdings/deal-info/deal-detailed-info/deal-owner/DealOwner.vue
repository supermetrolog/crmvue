<template>
  <div class="deal-owner">
    <router-link :to="'/companies/' + owner.company_id" target="_blank">
      <p :title="owner.name" class="owner_name deal-owner__text">
        {{ owner.name }}
      </p>
    </router-link>
      <!-- РЕЙТИНГ ПОКА НЕ РЕАЛИЗОВАН -->
      <!-- <rating :rating="owner.rating" class="deal-owner__rating" /> -->

      <!-- ПОКА НЕ РЕАЛИЗОВАНО -->
      <!-- <ul class="deal-owner__links">
      <li class="deal-owner__text deal-owner__text_link">
        {{
          plural(owner.contacts, "%d контакт", "%d контакта", "%d контактов")
        }},
      </li>
      <li class="deal-owner__text deal-owner__text_link">
        {{ plural(owner.requests, "%d запрос", "%d запроса", "%d запросов") }},
      </li>
      <li class="deal-owner__text deal-owner__text_link">
        {{ plural(owner.objects, "%d объект", "%d объекта", "%d объектов") }}
      </li>
    </ul> -->
             <!-- ПРЕДСТАВИТЕЛЬ -->
      <p class="deal-owner__text deal-owner__text_weigth_bold">
        {{ owner.representative.name }}
      </p>
      <p class="deal-owner__text deal-owner__text_color_grey">
        {{ owner.representative.post }}
      </p>
      <!-- КОНТАКТЫ -->
      <ul class="deal-owner__phones">
        <li v-for="phone in owner.phones" :key="phone.id" class="deal-owner__text">
          {{ $formatter.formatPhoneNumber(phone.phone)}}
        </li>
      </ul>
     
      <ul class="deal-owner__emails">
        <li v-for="email in owner.emails" :key="email.id" class="deal-owner__text">
          {{ email.email }}
        </li>
      </ul>    
    </div>


    <!--    <p :title="owner.name" class="deal-owner__text">{{ owner.name }}</p>-->
    <!--    <span>{{ owner.mainContact.phones.map((el) => el.phone).join(',') }}</span>-->
    <!--    <span>{{ owner.mainContact.emails.map((el) => el.email).join(',') }}</span>-->

    <!-- <ul class="deal_owner__phone-numbers">
      <li
        v-for="number in owner.phoneNumbers"
        :key="number"
        class="deal-owner__text"
      >
        {{ $formatter.formatPhoneNumber(number) }}
      </li>
    </ul> -->


</template>

<script lang="ts">
  import { PropType, defineComponent } from "vue";
  import plural from "plural-ru";
  //import Rating from "@/components/common/rating/Rating.vue";
  import { IOwner } from "../../../../../../interfaces/deal.interface";

  export default defineComponent({
    name: "DealOwner",
    components: {
      //  Rating,
    },
    props: {
      owner: {
        type: Object as PropType <IOwner>,
        required: true,
      },
    },
    data() {
      return {
        plural: plural,
      };
    },
    computed: {},
  });
</script>

<style src="./DealOwner.scss" lang="scss" />