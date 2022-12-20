<template>
  <div
    class="CompanyBoxObjectsRenter"
    :class="{
      'CompanyBoxObjectsRenter-danger': false,
      'CompanyBoxObjectsRenter-success': true,
    }"
  >
    <a class="CompanyBoxObjectsRenter-logo">
      <img
        src="https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png"
        alt="нет лого"
        v-if="deal.logo"
      />
      <span v-else>нет лого</span>
    </a>
    <div class="CompanyBoxObjectsRenter-info">
      <span class="CompanyBoxObjectsRenter-info-name">{{
        deal.company.nameRu
      }}</span>
      <ul class="CompanyBoxObjectsRenter-info-list">
        <li>
          <span>чья сделка:</span>
          <span v-if="deal.is_our == 1">PENNY LANE REALTY</span>
          <span v-else-if="deal.is_competitor">{{ deal.competitor }}</span>
          <span v-else>нет данных</span>
        </li>
        <li>
          <span>площадь:</span>
          <span v-if="deal.area">{{ deal.area }} м2</span>
          <span v-else>нет данных</span>
        </li>
        <template v-if="extraIsOpen">
          <li>
            <span>цена пола:</span>
            <span v-if="deal.floorPrice">{{ deal.floorPrice }} м2/г</span>
            <span v-else>нет данных</span>
          </li>
          <li>
            <span>дата сделки:</span>
            <span v-if="deal.dealDate">{{ dateFormatter(deal.dealDate) }}</span>
            <span v-else>нет данных</span>
          </li>
          <li>
            <span>консультант:</span>
            <span v-if="deal.consultant_id">{{ deal.consultant_id }}</span>
            <span v-else>нет данных</span>
          </li>
          <li>
            <span>срок:</span>
            <span v-if="deal.contractTerm"
              >{{ deal.contractTerm }} месяцев</span
            >
            <span v-else>нет данных</span>
          </li>
        </template>
      </ul>
    </div>
    <DropdownSwitcher
      class="CompanyBoxObjectsRenter-button"
      v-model="extraIsOpen"
    />
  </div>
</template>

<script>
import DropdownSwitcher from "../../../common/dropdown/DropdownSwitcher.vue";
import moment from "moment";
export default {
  name: "CompanyBoxObjectsRenter",
  components: { DropdownSwitcher },
  props: {
    deal: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      extraIsOpen: false,
    };
  },
  computed: {},
  methods: {
    dateFormatter(date) {
      return moment(date).format("DD.MM.YYYY");
    },
  },
};
</script>