<template>
  <div class="trade-offers-item-tabs">
    <Tabs
      :options="{ useUrlFragment: false }"
      nav-class="trade-offers-item-tabs__list"
      nav-item-link-class="trade-offers-item-tabs__link"
    >
      <Tab name="Свобдка">
        <div class="trade-offers-item-tabs__tab-body">123</div>
      </Tab>
      <Tab name="Подробно">
        <div class="trade-offers-item-tabs__tab-body">123</div>
      </Tab>
      <Tab name="Описание">
        <div class="trade-offers-item-tabs__tab-body">123</div>
      </Tab>
      <Tab name="Фото">
        <div class="trade-offers-item-tabs__tab-body">123</div>
      </Tab>
      <Tab name="Клиенты">
        <div class="trade-offers-item-tabs__tab-body">123</div>
      </Tab>
      <Tab name="Задачи">
        <div class="trade-offers-item-tabs__tab-body">123</div>
      </Tab>
      <Tab name="Парам. Сделки">
        <div class="trade-offers-item-tabs__tab-body">123</div>
      </Tab>
    </Tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TradeOfferItemTabs",
  components: {},
  // props: {},
  data() {
    return {};
  },
  methods: {},
});
</script>
<style lang="scss" src="./TradeOfferItemTabs.scss" />
