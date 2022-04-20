<template>
  <div class="company-request-search-form">
    <Form class="autosize px-5" @submit="onSubmit">
      <FormGroup class="mb-2">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="ID, адрес, собственник, телефон, ФИО"
          class="col-12 main-input pr-1"
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
      </FormGroup>
      <div v-if="extraVisible">
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
            label="Наличие воды"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.gas"
            :unselectMode="true"
            label="Наличие газа"
            class="col pr-1 text-center"
            :options="yesNoFUCKOptions"
          />
          <Radio
            v-model="form.steam"
            :unselectMode="true"
            label="Наличие пара"
            class="col pr-1 text-center"
            :options="yesNoFUCKOptions"
          />
          <Radio
            v-model="form.sewage_central"
            :unselectMode="true"
            label="Наличие КНС"
            class="col pr-1 text-center"
            :options="yesNoFUCKOptions"
          />
          <Radio
            v-model="form.racks"
            :unselectMode="true"
            label="Наличие стеллажей"
            class="col text-center pr-1"
            :options="yesNoFUCKOptions"
          />
        </FormGroup>
        <FormGroup class="mb-2">
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
            label="Наличие кранов"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Checkbox
            v-model="form.floor_types"
            class="col-4 pr-1"
            label="Тип пола"
            :options="floorTypesFUCKOptions"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <CheckboxIcons
            v-model="form.purposes"
            label="Тип объекта"
            extraLabel="склад"
            class="col-4 pr-2 mx-auto"
            :options="objectTypeListWareHouse"
          />
          <CheckboxIcons
            v-model="form.purposes"
            extraLabel="производство"
            class="col-4 mt-4 pr-2 mx-auto"
            :options="objectTypeListProduction"
          />
          <CheckboxIcons
            v-model="form.purposes"
            extraLabel="участок"
            class="col-4 mt-4 mx-auto"
            :options="objectTypeListPlot"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <MultiSelect
            v-model="form.region"
            label="Регионы"
            class="col-4 pr-1"
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
    region: [],
    direction: [],
    district_moscow: [],
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST"]),
    async setQueryFields() {
      this.form = { ...this.form, ...this.$route.query };
      if (this.form.class && !Array.isArray(this.form.class)) {
        this.form.class = [this.form.class];
      }
      if (this.form.gates && !Array.isArray(this.form.gates)) {
        this.form.gates = [this.form.gates];
      }
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
  },
};
</script>

<style>
</style>