<template>
  <div class="ObjectHoldingsOwnerItem">
    <span class="ObjectHoldingsOwnerItem-header">Собственник {{ index }}</span>
    <span class="ObjectHoldingsOwnerItem-name">{{ owner.name }}</span>
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
