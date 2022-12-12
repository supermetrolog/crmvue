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
      />
      <!-- <span>нет лого</span> -->
    </a>
    <div class="CompanyBoxObjectsRenter-info">
      <span class="CompanyBoxObjectsRenter-info-name"
        >Атом Сталь Энергомаш Корпорация Росатом</span
      >
      <ul class="CompanyBoxObjectsRenter-info-list">
        <li>
          <span>чья сделка:</span>
          <span>нет данных</span>
        </li>
        <li>
          <span>площадь:</span>
          <span>нет данных</span>
        </li>
        <template v-if="extraIsOpen">
          <li>
            <span>цена пола:</span>
            <span>нет данных</span>
          </li>
          <li>
            <span>дата сделки:</span>
            <span>нет данных</span>
          </li>
          <li>
            <span>консультант:</span>
            <span>нет данных</span>
          </li>
          <li>
            <span>срок:</span>
            <span>нет данных</span>
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
export default {
  name: "CompanyBoxObjectsRenter",
  components: { DropdownSwitcher },
  props: {},
  data() {
    return {
      extraIsOpen: false,
    };
  },
  computed: {},
  methods: {},
};
</script>