<template>
  <div class="ObjectHoldingsParameters">
    <div class="ObjectHoldingsParameters-wrapper">
      <div class="ObjectHoldingsParameters-main">
        <p class="ObjectHoldingsParameters-main-area">
          <with-unit-type
            :value="formattedArea"
            :unitType="unitTypes.SQUARE_METERS"
          />
          (по этажам:
          <with-unit-type
            :value="formattedFloorArea"
            :unitType="unitTypes.SQUARE_METERS"
          />
          )
        </p>
        <p class="ObjectHoldingsParameters-main-address">{{ fullAddress }}</p>
      </div>
      <div class="ObjectHoldingsParameters-types" v-if="holdingTypes">
        <template v-if="holdingTypes.length > 0">
          <strong
            class="object-type-box"
            v-for="objectType of holdingTypes"
            :key="objectType.id"
            :title="getObjectTypeName(objectType.object_type)"
          >
            <i :class="getObjectTypeIcon(objectType.object_type)"></i>
          </strong>
        </template>
        <div v-if="holdingTypes.length == 0 && holdingTypesGeneral.length == 0">
          <p>нет данных</p>
        </div>
      </div>
      <div class="ObjectHoldingsParameters-provision">
        <parameters
          :height="parameters.characteristics.height"
          :floorType="parameters.characteristics.floorType"
          :gatesNumber="parameters.characteristics.gatesNumber"
          :electricity="parameters.communications.electricity"
          :heating="parameters.communications.heating"
          :sewage="parameters.communications.sewage"
          :gasForProduction="parameters.communications.gasForProduction"
          :liftingDevices="parameters.liftingDevices.lifts"
          :shelving="parameters.facilities.shelving"
        />
      </div>
      <!-- <div class="ObjectHoldingsParameters-equipment">
        <p>Краны</p>
        <div>
          <span>Тельфер/лебедка (неподвижн)</span>
        </div>
      </div>
      <div class="ObjectHoldingsParameters-equipment">
        <p>Подъемники</p>
        <div>
          <span>Грузовой лифт</span>
        </div>
      </div> -->
    </div>
    <div class="ObjectHoldingsParameters-floors" v-if="floors.length > 0">
      <div
        class="ObjectHoldingsParameters-floor"
        :class="{ danger: floor.danger }"
        v-for="floor in floors"
        :key="floor.number"
      >
        <span>{{ floor.number }} этаж</span>
        <i
          class="fas fa-exclamation-circle text-danger"
          v-if="floor.danger"
          title="Внимание"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { ObjectTypeList } from "@/const/Const.js";
import "./styles.scss";
import Parameters from "../../ui/parameters/Parameters.vue";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import { unitTypes } from "@/const/unitTypes";
export default {
  name: "ObjectHoldingsParameters",
  components: {
    Parameters,
    WithUnitType,
  },
  props: {
    holdingTypes: {
      type: Array,
      default: () => [],
      required: true,
    },
    holdingTypesGeneral: {
      type: Array,
      default: () => [],
      required: true,
    },
    floors: {
      type: Array,
      default: () => [],
      required: true,
    },
    parameters: {
      type: Object,
      required: true,
    },
    area: {
      type: Object,
      required: true,
    },
    floorArea: {
      type: Object,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
      unitTypes,
      // objectTypesGeneralList: ObjectTypesGeneralList.get("param"),
    };
  },
  methods: {
    getObjectTypeIcon(objectType) {
      if (objectType < 12) {
        return this.objectTypeListWareHouse.find(
          (item) => item[0] == objectType
        )[1].icon;
      }
      if (objectType < 25) {
        return this.objectTypeListProduction.find(
          (item) => item[0] == objectType
        )[1].icon;
      }
      return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
        .icon;
    },
    getObjectTypeName(objectType) {
      if (objectType < 12) {
        return this.objectTypeListWareHouse.find(
          (item) => item[0] == objectType
        )[1].name;
      }
      if (objectType < 25) {
        return this.objectTypeListProduction.find(
          (item) => item[0] == objectType
        )[1].name;
      }
      return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
        .name;
    },
    // getObjectTypesGeneral(types) {
    //     return types
    //         .map((type) => type.type)
    //         .map(
    //             (type) =>
    //                 this.objectTypesGeneralList.find((item) => item[0] == type)[1]
    //         )
    //         .join(", ");
    // },
  },
  computed: {
    formattedArea() {
      return this.$formatter.numberOrRange(
        this.area.valueMin,
        this.area.valueMax
      );
    },
    formattedFloorArea() {
      return this.$formatter.numberOrRange(
        this.floorArea.valueMin,
        this.floorArea.valueMax
      );
    },
    fullAddress() {
      return (
        this.address.district +
        ", " +
        this.address.city +
        ", " +
        this.address.street +
        " " +
        this.address.houseNumber
      );
    },
  },
};
</script>
