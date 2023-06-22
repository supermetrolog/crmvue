<template>
  <div class="ComplexAbout" id="ComplexAbout">
    <Tabs :options="{ useUrlFragment: false }">
      <Tab name="О комплексе">
        <div class="ComplexAbout-content">
          <template v-if="dataAvailable">
<!--            <PropertyList :title="'Площади'">-->
<!--              <PropertyListItem-->
<!--                v-for="(prop, idx) in area"-->
<!--                :key="prop.name + idx"-->
<!--                :name="prop.name"-->
<!--                :value="prop.value"-->
<!--                :valueMin="prop.valueMin"-->
<!--                :valueMax="prop.valueMax"-->
<!--                :unitType="prop.unitType"-->
<!--              />-->
<!--            </PropertyList>-->
<!--            <PropertyList :title="'Коммуникации'">-->
<!--              <PropertyListItem-->
<!--                v-for="(prop, idx) in communications"-->
<!--                :key="prop.name + idx"-->
<!--                :name="prop.name"-->
<!--                :value="prop.value"-->
<!--                :unitType="prop.unitType"-->
<!--              />-->
<!--            </PropertyList>-->
            <PropertyList :title="'Безопасность'">
              <PropertyListItem
                v-for="(prop, idx) in safety"
                :key="prop.name + idx"
                :name="prop.name"
                :value="prop.value"
                :unitType="prop.unitType"
              />
            </PropertyList>
            <PropertyList :title="['Ж/Д на территории', 'Инфраструктура']">
              <template #0>
                <PropertyListItem
                  v-for="(prop, idx) in railway"
                  :key="prop.name + idx"
                  :name="prop.name"
                  :value="prop.value"
                  :unitType="prop.unitType"
                />
              </template>
              <template #1>
                <PropertyListItem
                  v-for="(prop, idx) in infrastructure"
                  :key="prop.name + idx"
                  :name="prop.name"
                  :value="prop.value"
                  :unitType="prop.unitType"
                />
              </template>
            </PropertyList>
          </template>
          <template v-else>Нет данных</template>
        </div>
      </Tab>
      <Tab name="План Территории">
        <div class="ComplexAbout-content">123</div>
      </Tab>
      <Tab name="Презентации">
        <div class="ComplexAbout-content">123</div>
      </Tab>
      <Tab name="Документы">
        <div class="ComplexAbout-content">123</div>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import PropertyListItem from "../../common/property-list/property-list-item/PropertyListItem.vue";
import PropertyList from "../../common/property-list/PropertyList.vue";
import "./styles.scss";

export default {
  name: "ComplexAbout",
  components: { PropertyList, PropertyListItem },
  props: {
    complex: {
      type: Object
    },
    safety: {
      type: Array,
    },
    railway: {
      type: Array,
    },
    infrastructure: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    dataAvailable() {
      return (
        // this.area &&
        // this.communications &&
        this.safety &&
        this.railway &&
        this.infrastructure
      );
    },
  },
  methods: {},
  mounted() {
    if (this.isMobile) {
      return;
    } else {
      requestAnimationFrame(() => {
        const listElement = document.getElementById("ComplexAbout");
        const listHeight = listElement.clientHeight;
        // document.getElementById("ComplexAbout").style.height = `${listHeight}px`;
        console.log("List height:", listHeight);
      });
    }
  },
};
</script>
