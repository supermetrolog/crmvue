<template>
  <div class="ObjectHoldingsOwnerItem">
    <span class="ObjectHoldingsOwnerItem-name">{{ owner.full_name }}</span>
    <div class="ObjectHoldingsOwnerItem-rating">
      <rating :rating="owner.rating || 0"/>
    </div>
    <div class="ObjectHoldingsOwnerItem-links">
      <span v-if="owner.contacts_count"
      >{{
          plural(
              owner.contacts_count,
              "%d контакт",
              "%d контакта",
              "%d контактов"
          )
        }},
      </span>
      <span v-if="owner.request_count"
      >{{
          plural(
              owner.request_count,
              "%d запрос",
              "%d запроса",
              "%d запросов"
          )
        }},
      </span>
      <span v-if="owner.object_count">
        {{
          plural(owner.object_count, "%d объект", "%d объекта", "%d объектов")
        }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import plural from "plural-ru";
import "./styles.scss";
import Rating from "@/components/common/rating/Rating.vue";
import {defineComponent, PropType} from "vue";
import {ICompany} from "@/interfaces/company.interface";

export default defineComponent({
  name: "ObjectHoldingsOwnerItem",
  components: {
    Rating,
  },
  props: {
    owner: {
      type: Object as PropType<ICompany>,
      default: () => {
      },
    },
  },
  data() {
    return {
      plural: plural,
    };
  },
  computed: {},
  methods: {},
});
</script>

<style lang="scss" scoped></style>
