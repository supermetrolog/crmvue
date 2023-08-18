<template>
  <div class="deal-owner">
    <p :title="owner.full_name" class="deal-owner__text">{{ owner.full_name }}</p>
    <span>{{ owner.mainContact.phones.map((el) => el.phone).join(',') }}</span>
    <span>{{ owner.mainContact.emails.map((el) => el.phone).join(',') }}</span>

    
         
    <!-- <rating :rating="owner.rating" class="deal-owner__rating" />
    <ul class="deal-owner__links">
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
    <p class="deal-owner__text deal-owner__text_weigth_bold">
      {{ owner.representative.name }}
    </p>
    <p class="deal-owner__text deal-owner__text_color_grey">
      {{ owner.representative.post }}
    </p>
    <!-- <ul class="deal_owner__phone-numbers">
      <li
        v-for="number in owner.phoneNumbers"
        :key="number"
        class="deal-owner__text"
      >
        {{ $formatter.formatPhoneNumber(number) }}
      </li>
    </ul> -->
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import plural from "plural-ru";
//import Rating from "@/components/common/rating/Rating.vue";
import { IOwner } from "../../../deals/deal.interface";

export default defineComponent({
  name: "DealOwner",
  components: {
  //  Rating,
  },
  props: {
    owner: {
      type: Object as PropType<IOwner>,
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
