<template>
  <div class="deal-deatiled-info">
    <building-info :area="buildingInfo.area" :price="buildingInfo.price" />
  </div>
</template>

<script>
import BuildingInfo from "./building-info/BuildingInfo.vue";

export default {
  name: "DealDetailedInfo",
  components: {
    BuildingInfo,
  },
  data() {
    return {
      buildingInfo: {
        area: {
          sum: {
            value: "2000 - 15000",
            unitType: 1,
          },
          list: [
            {
              label: "S - пол 1 эт.",
              value: "1000-3600",
              unitType: 1,
            },
            {
              label: "S - пол 2 эт.",
              value: "1000-3600",
              unitType: 1,
            },
            {
              label: "S - пол 3 эт.",
              value: "1000-3600",
              unitType: 1,
            },
            {
              label: "S - пол 6 эт.",
              value: "1920",
              unitType: 1,
            },
            {
              label: "S - мезон 1 яр.",
              value: "1000-3600",
              unitType: 1,
            },
            {
              label: "S - офисов",
              value: "1200-2000",
              unitType: 1,
            },
          ],
        },
        price: {
          sum: {
            value: "1200000 - 16500685",
            unitType: 9,
          },
          list: [
            {
              label: "E - пол 1 эт.",
              value: "500-800",
              unitType: 8,
            },
            {
              label: "E - пол 2 эт.",
              value: "6500-12000",
              unitType: 8,
            },
            {
              label: "E - пол 3 эт.",
              value: "1100000-16100000",
              unitType: 8,
            },
            {
              label: "E - пол 6 эт.",
              value: "2500-4500",
              unitType: 8,
            },
            {
              label: "E - мезон 1 яр.",
              value: "3250",
              unitType: 8,
            },
            {
              label: "E - офисов",
              value: "не заполнено",
            },
          ],
        },
      },
    };
  },
  methods: {},
};
</script>

<style src="./DealDetailedInfo.scss" lang="scss"></style>
