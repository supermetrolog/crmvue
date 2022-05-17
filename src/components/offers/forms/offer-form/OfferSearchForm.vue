<template>
  <div class="company-request-search-form">
    <Form class="autosize px-5" @submit="onSubmit">
      <FormGroup class="mb-2">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="ID, адрес, собственник, телефон, ФИО"
          class="col-12 main-input"
          @keydown.enter="onSubmit"
        />
      </FormGroup>
      <FormGroup>
        <a
          href="#"
          @click.prevent="extraVisible = !extraVisible"
          class="text-primary"
        >
          фильтры
          <span class="badge badge-danger" v-if="filterCount">
            {{ filterCount }}
          </span>
          <i class="fas fa-angle-down" v-if="!extraVisible"></i>
          <i class="fas fa-angle-up" v-else></i>
        </a>
        <a
          href="#"
          @click.prevent="resetForm"
          class="text-primary ml-5"
          v-if="filterCount"
        >
          сбросить
        </a>
      </FormGroup>
      <div v-show="extraVisible">
        <FormGroup class="mb-2">
          <MultiSelect
            v-model="form.agent_id"
            label="Консультант"
            class="col-4 pr-1"
            :options="
              async () => {
                return await FETCH_CONSULTANT_LIST();
              }
            "
          />

          <MultiSelect
            v-model="form.deal_type"
            label="Тип сделки"
            class="col-2 pr-1"
            :options="dealTypeList"
          />
          <Input
            v-model="form.rangeMaxDistanceFromMKAD"
            maska="###"
            placeholder="не более"
            label="Удаленность от МКАД"
            class="col-3 pr-1"
          />
          <Input
            v-model="form.rangeMinElectricity"
            placeholder="не менее"
            maska="##########"
            label="Электричесвто (квт)"
            class="col-3"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Input
            v-model="form.rangeMinArea"
            maska="##########"
            label="S пола (м^2)"
            placeholder="От:"
            class="col-3 pr-1"
          >
            <Input
              v-model="form.rangeMaxArea"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Input
            v-model="form.rangeMinPricePerFloor"
            maska="##########"
            placeholder="От:"
            label="Цена (продажи, аренды, о-х)"
            class="col-3 pr-1"
          >
            <Input
              v-model="form.rangeMaxPricePerFloor"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Input
            v-model="form.rangeMinCeilingHeight"
            maska="##########"
            label="Высота потолков"
            placeholder="От:"
            class="col-3 pr-1"
          >
            <Input
              v-model="form.rangeMaxCeilingHeight"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <MultiSelect
            v-model="form.region"
            label="Регионы"
            class="col-3"
            mode="multiple"
            :options="regionList"
            @change="changeRegion"
          >
            <small
              v-for="(region, index) in form.region"
              :key="region"
              class="d-block px-3"
            >
              {{ index + 1 }}. {{ regionList[region].label }}
            </small>
            <Checkbox
              v-if="form.region.find((item) => item == 1)"
              v-model="form.direction"
              class="col-12 p-0"
              label="Направления"
              :options="directionList"
            />
            <Checkbox
              v-if="form.region.find((item) => item == 0) == 0"
              v-model="form.district_moscow"
              class="col-12 p-0"
              label="Округа Москвы"
              :options="districtList"
            />
          </MultiSelect>
        </FormGroup>
        <FormGroup class="mb-2">
          <Checkbox
            v-model="form.class"
            class="col-2 pr-1"
            label="Классы"
            :options="objectClassList"
          />
          <Checkbox
            v-model="form.gates"
            class="col-4 pr-1"
            label="Тип ворот"
            :options="gateTypeList"
          />
          <Checkbox
            v-model="form.floor_types"
            class="col-4 pr-1"
            label="Тип пола"
            :options="floorTypesFUCKOptions"
          />
          <Radio
            v-model="form.heated"
            :unselectMode="true"
            label="Отапливаемый"
            class="col-2 text-center pr-1"
            :options="yesNoFUCKOptions"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Radio
            v-model="form.water"
            :unselectMode="true"
            label="Вода"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.gas"
            :unselectMode="true"
            label="Газ"
            class="col pr-1 text-center"
            :options="yesNoFUCKOptions"
          />
          <Radio
            v-model="form.steam"
            :unselectMode="true"
            label="Пар"
            class="col pr-1 text-center"
            :options="yesNoFUCKOptions"
          />
          <Radio
            v-model="form.sewage_central"
            :unselectMode="true"
            label="КНС"
            class="col pr-1 text-center"
            :options="yesNoFUCKOptions"
          />
          <Radio
            v-model="form.racks"
            :unselectMode="true"
            label="Стеллажи"
            class="col text-center pr-1"
            :options="yesNoFUCKOptions"
          />
          <Radio
            v-model="form.railway"
            :unselectMode="true"
            label="Ж/Д ветка"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.has_cranes"
            :unselectMode="true"
            label="Краны"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.status"
            :options="activePassiveOptions"
            :unselectMode="true"
            label="Статус"
            class="col text-center"
          />
          <!-- <div class="col-2 align-self-center ml-auto">
            <button
              class="btn btn-warning btn-large"
              @click.prevent="resetForm"
            >
              Сбросить
            </button>
          </div> -->
        </FormGroup>
        <FormGroup class="mb-2">
          <CheckboxIcons
            v-model="form.purposes"
            label="Тип объекта"
            extraLabel="склад"
            :noAllSelect="true"
            :extraValue="1"
            :extraOptions="form.object_type"
            @extraSelect="selectObjectType"
            class="col-4 pr-2 mx-auto"
            :options="objectTypeListWareHouse"
          />
          <CheckboxIcons
            v-model="form.purposes"
            extraLabel="производство"
            :noAllSelect="true"
            :extraValue="2"
            :extraOptions="form.object_type"
            @extraSelect="selectObjectType"
            class="col-4 mt-4 pr-2 mx-auto"
            :options="objectTypeListProduction"
          />
          <CheckboxIcons
            v-model="form.purposes"
            extraLabel="участок"
            :noAllSelect="true"
            :extraValue="3"
            :extraOptions="form.object_type"
            @extraSelect="selectObjectType"
            class="col-4 mt-4 mx-auto"
            :options="objectTypeListPlot"
          />
        </FormGroup>
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import Radio from "@/components/common/form/Radio.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
import { SearchFormMixin } from "@/components/common/mixins.js";
import { mapActions } from "vuex";
import {
  DealTypeList,
  ObjectClassList,
  GateTypeList,
  YesNoFUCK,
  YesNo,
  FloorTypesFUCK,
  ObjectTypeList,
  RegionList,
  DirectionList,
  DistrictList,
  ActivePassiveFUCK,
} from "@/const/Const.js";
export default {
  mixins: [SearchFormMixin],
  name: "OfferSearchForm",
  components: {
    Form,
    FormGroup,
    Input,
    MultiSelect,
    Checkbox,
    Radio,
    CheckboxIcons,
  },
  data() {
    return {
      dealTypeList: DealTypeList.get("param"),
      objectClassList: ObjectClassList.get("param"),
      gateTypeList: GateTypeList.get("param"),
      yesNoFUCKOptions: YesNoFUCK.get("param"),
      yesNoOptions: YesNo.get("param"),
      floorTypesFUCKOptions: FloorTypesFUCK.get("param"),
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
      regionList: RegionList.get("param"),
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      activePassiveOptions: ActivePassiveFUCK.get("param"),
    };
  },
  defaultFormProperties: {
    all: null,
    rangeMinElectricity: null,
    rangeMaxDistanceFromMKAD: null,
    deal_type: null,
    agent_id: null,
    rangeMaxArea: null,
    rangeMinArea: null,
    rangeMaxPricePerFloor: null,
    rangeMinPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    class: [],
    gates: [],
    heated: null,
    water: null,
    gas: null,
    steam: null,
    sewage_central: null,
    racks: null,
    railway: null,
    has_cranes: null,
    floor_types: [],
    purposes: [],
    object_type: [],
    region: [],
    direction: [],
    district_moscow: [],
    status: null,
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST"]),
    async setQueryFields() {
      this.form = { ...this.form, ...this.$route.query };
      if (this.form.purposes && !Array.isArray(this.form.purposes)) {
        this.form.purposes = [this.form.purposes];
      }
      if (this.form.class && !Array.isArray(this.form.class)) {
        this.form.class = [this.form.class];
      }
      if (this.form.gates && !Array.isArray(this.form.gates)) {
        this.form.gates = [this.form.gates];
      }
      if (this.form.region && !Array.isArray(this.form.region)) {
        this.form.region = [this.form.region];
      }
      if (this.form.direction && !Array.isArray(this.form.direction)) {
        this.form.direction = [this.form.direction];
      }
      if (
        this.form.district_moscow &&
        !Array.isArray(this.form.district_moscow)
      ) {
        this.form.district_moscow = [this.form.district_moscow];
      }
      if (this.form.object_type && !Array.isArray(this.form.object_type)) {
        this.form.object_type = [this.form.object_type];
      }

      if (this.form.floor_types && !Array.isArray(this.form.floor_types)) {
        this.form.floor_types = [this.form.floor_types];
      }
      let array = [];
      this.form.purposes.forEach((item) => {
        array.push(+item);
      });
      this.form.purposes = array;
      array = [];
      this.form.object_type.forEach((item) => {
        array.push(+item);
      });
      this.form.object_type = array;
      let query = { ...this.form };
      this.deleteEmptyFields(query);
      await this.$router.replace({ query });
    },
    changeRegion() {
      if (this.form.region == null) {
        this.form.direction = [];
        this.form.district_moscow = [];
      }
      if (!this.form.region.find((item) => item == 1)) {
        this.form.direction = [];
      }
      if (this.form.region.find((item) => item == 0) != 0) {
        this.form.district_moscow = [];
      }
    },
    selectObjectType(isSelected, type) {
      this.form.object_type = this.form.object_type.filter(
        (item) => item != type
      );
      if (isSelected) {
        this.form.object_type.push(type);
      }
      console.log(isSelected, type);
    },
  },
};
</script>

<style>
</style>