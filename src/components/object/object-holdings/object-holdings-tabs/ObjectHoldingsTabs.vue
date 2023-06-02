<template>
  <div class="ObjectHoldingsTabs">
    <Tabs :options="{ useUrlFragment: false }">
      <Tab name="Характеристики">
        <div class="ObjectHoldingsTabs-content-properties">
          <PropertyList>
            <PropertyListItem
              v-for="(prop, idx) in holdingsProperties[0]"
              :key="prop.name + idx"
              :name="prop.name"
              :value="prop.value"
              :unitType="prop.unitType"
            />
          </PropertyList>
          <PropertyList>
            <PropertyListItem
              v-for="(prop, idx) in holdingsProperties[1]"
              :key="prop.name + idx"
              :name="prop.name"
              :value="prop.value"
              :unitType="prop.unitType"
            />
          </PropertyList>
          <PropertyList>
            <PropertyListItem
              v-for="(prop, idx) in holdingsProperties[2]"
              :key="prop.name + idx"
              :name="prop.name"
              :value="prop.value"
              :unitType="prop.unitType"
            />
          </PropertyList>
          <PropertyList>
            <PropertyListItem
              v-for="(prop, idx) in holdingsProperties[3]"
              :key="prop.name + idx"
              :name="prop.name"
              :value="prop.value"
              :unitType="prop.unitType"
            />
          </PropertyList>
        </div>
      </Tab>
      <Tab name="Сделки">
        <div class="ObjectHoldingsTabs-content">
          <ObjectHoldingDeals />
        </div>
      </Tab>
      <Tab name="Карта сделок"></Tab>
      <Tab name="Планировки"></Tab>
      <Tab name="Презентации"></Tab>
      <Tab name="Договоры"></Tab>
      <Tab name="Панорамы"></Tab>
      <Tab name="Описание"></Tab>
      <Tab name="Задачи"></Tab>
    </Tabs>
  </div>
</template>

<script>
import PropertyListItem from "../../../common/property-list/property-list-item/PropertyListItem.vue";
import PropertyList from "../../../common/property-list/PropertyList.vue";
import ObjectHoldingDeals from "../deals/Deals.vue";
import "./styles.scss";

export default {
  name: "ObjectHoldingsTabs",
  components: { PropertyList, PropertyListItem, ObjectHoldingDeals },
  props: {
    holdingsProperties: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
