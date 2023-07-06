<template>
  <div class="ObjectHoldingsParameters">
    <div class="ObjectHoldingsParameters-wrapper">
      <div class="ObjectHoldingsParameters-main">
        <p class="ObjectHoldingsParameters-main-area">
          <with-unit-type
            v-if="object.areaBuilding !== null || object.areaField !== null"
            :value="formattedArea"
            :unitType="unitTypes.SQUARE_METERS"
          />
          <span v-else>не заполнено</span>
          <template v-if="!object.objectType?.includes(3)">
            (по этажам:
            <with-unit-type
              v-if="object.floorArea !== null"
              :value="formattedFloorArea"
              :unitType="unitTypes.SQUARE_METERS"
            />
            <span v-else>не заполнено</span>
            )
          </template>
        </p>
        <p class="ObjectHoldingsParameters-main-address">{{ object.address || "Адрес не заполнен" }}</p>
      </div>
      <div class="ObjectHoldingsParameters-types" v-if="object.purposes">
        <template v-if="object.purposes?.length > 0 && object.objectType">
          <strong
            class="object-type-box"
            v-for="purpose of object.purposes"
            :key="purpose"
            :title="getObjectTypeName(purpose)"
          >
            <i :class="getObjectTypeIcon(purpose)"></i>
          </strong>
        </template>
      </div>
      <div class="ObjectHoldingsParameters-provision" v-if="object">
        <parameters
          :object="object"
        />
      </div>
      <div class="ObjectHoldingsParameters-equipment">
        <teleport to="body">
          <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
          >
            <AddCraneForm v-if="addCraneFormIsVisible" @close="toggleAddCraneFormIsVisible"/>
          </transition>
        </teleport>
        <teleport to="body">
          <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
          >
            <AddElevatorForm v-if="addElevatorFormIsVisible" @close="toggleAddElevatorFormIsVisible"/>
          </transition>
        </teleport>
        <p class="ObjectHoldingsParameters-equipment-label">Краны</p>
        <ul class="ObjectHoldingsParameters-equipment-list">
          <li class="ObjectHoldingsParameters-equipment-item" v-for="crane in object.cranes" :key="crane.id">
            <span class="ObjectHoldingsParameters-equipment-text" v-if="crane.crane_type">{{ crane.crane_type }}</span>
            <span class="ObjectHoldingsParameters-equipment-text"
                  v-if="crane.crane_capacity"> / {{ crane.crane_capacity }} тонн</span>
            <span class="ObjectHoldingsParameters-equipment-text" v-if="crane.crane_location"> / {{
                crane.crane_location
              }}</span>
            <span class="ObjectHoldingsParameters-equipment-text" v-if="crane.crane_hook_height"> / до крюка {{
                crane.crane_hook_height
              }} м</span>
            <span class="ObjectHoldingsParameters-equipment-text" v-if="crane.crane_condition"> / {{
                crane.crane_condition
              }}</span>
          </li>
          <li class="ObjectHoldingsParameters-equipment-item-button">
            <button @click="toggleAddCraneFormIsVisible" class="ObjectHoldingsParameters-equipment-button">
              <i class="fas fa-plus-circle"></i> Добавить кран
            </button>
          </li>
        </ul>
        <p class="ObjectHoldingsParameters-equipment-label">Подъемники</p>
        <button @click="toggleAddElevatorFormIsVisible" class="ObjectHoldingsParameters-equipment-button">
          <i class="fas fa-plus-circle"></i> Добавить подъемник
        </button>
      </div>
    </div>
    <!--		<div class="ObjectHoldingsParameters-floors" v-if="object.floors.length > 0">-->
    <!--			<div-->
    <!--					class="ObjectHoldingsParameters-floor"-->
    <!--					:class="{ danger: object.floors.danger }"-->
    <!--					v-for="floor in object.floors"-->
    <!--					:key="floor.number"-->
    <!--			>-->
    <!--				<span>{{ floor.number }} этаж</span>-->
    <!--				<i-->
    <!--						class="fas fa-exclamation-circle text-danger"-->
    <!--						v-if="floor.danger"-->
    <!--						title="Внимание"-->
    <!--				></i>-->
    <!--			</div>-->
    <!--		</div>-->
  </div>
</template>

<script lang="ts">
import "./styles.scss";
import Parameters from "@/components/complex/ui/parameters/Parameters.vue";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import {unitTypes} from "@/const/unitTypes";
import {defineComponent, PropType} from "vue";
import IObject from "@/interfaces/object.interface";
import {objectPurposes} from "@/const/constTypes";
import AddCraneForm from "@/components/complex/object-holdings/forms/add-crane-form/AddCraneForm.vue";
import AddElevatorForm from "@/components/complex/object-holdings/forms/add-elevator-form/AddElevatorForm.vue";

export default defineComponent({
  name: "ObjectHoldingsParameters",
  components: {
    AddElevatorForm,
    AddCraneForm,
    Parameters,
    WithUnitType,
  },
  props: {
    object: {
      type: Object as PropType<IObject>,
      required: true
    }
  },
  data() {
    return {
      addCraneFormIsVisible: false,
      addElevatorFormIsVisible: false,
      unitTypes,
    };
  },
  methods: {
    toggleAddCraneFormIsVisible() {
      this.addCraneFormIsVisible = !this.addCraneFormIsVisible;
    },
    toggleAddElevatorFormIsVisible() {
      this.addElevatorFormIsVisible = !this.addElevatorFormIsVisible;
    },
    getObjectTypeIcon(purpose: number) {
      return objectPurposes[purpose].icon
    },
    getObjectTypeName(purpose: number) {
      return objectPurposes[purpose].name
    },
  },
  computed: {
    formattedArea() {
      if (this.object.objectType?.includes(3)) {
        return this.$formatter.number(
          this.object.areaField
        );
      } else {
        return this.$formatter.number(
          this.object.areaBuilding
        );
      }
    },
    formattedFloorArea() {
      return this.$formatter.number(
        this.object.floorArea
      );
    },
  },
})
</script>
