<template>
  <div class="company-request-search-form">
    <Form class="autosize" @submit="onSubmit">
      <FormGroup class="mb-2">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="название компании, ID компании, ФИО брокера, ФИО контакта, телефон"
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
      </FormGroup>
      <div v-show="extraVisible">
        <FormGroup class="mb-2">
          <MultiSelect
            v-model="form.consultant_id"
            label="Консультант"
            class="col-4 pr-1"
            :options="
              async () => {
                return await FETCH_CONSULTANT_LIST();
              }
            "
          />
          <Input
            v-model="form.dateStart"
            label="Дата от"
            class="col-2 pr-1"
            type="date"
          />
          <Input
            v-model="form.dateEnd"
            label="Дата до"
            class="col-2 pr-1"
            type="date"
          />
          <MultiSelect
            v-model="form.dealType"
            required
            label="Тип сделки"
            class="col-4"
            :options="dealTypeList"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <CheckboxIcons
            v-model="form.objectTypes"
            label="Тип объекта"
            extraLabel="склад"
            class="col-2 pr-2"
            :options="objectTypeListWareHouse"
          />
          <CheckboxIcons
            v-model="form.objectTypes"
            extraLabel="производство"
            class="col-2 mt-4 pr-2"
            :options="objectTypeListProduction"
          />
          <CheckboxIcons
            v-model="form.objectTypes"
            extraLabel="участок"
            class="col-2 mt-4 pr-2"
            :options="objectTypeListPlot"
          />
          <Radio
            v-model="form.status"
            :options="activePassiveOptions"
            :unselectMode="true"
            label="Статус"
            class="col-2 pr-1"
          />
          <div class="col-2 align-self-center">
            <button
              class="btn btn-warning btn-large"
              @click.prevent="resetForm"
            >
              Сбросить
            </button>
          </div>
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
            label="Цена за пол (м^2/год)"
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
          <Input
            v-model="form.maxDistanceFromMKAD"
            maska="###"
            placeholder="не более"
            label="Удаленность от МКАД"
            class="col-3"
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Radio
            v-model="form.water"
            :unselectMode="true"
            label="Наличие воды"
            class="col-2 pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.gaz"
            :unselectMode="true"
            label="Наличие газа"
            class="col-2 pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.steam"
            :unselectMode="true"
            label="Наличие пара"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.sewerage"
            :unselectMode="true"
            label="Наличие КНС"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.shelving"
            :unselectMode="true"
            label="Наличие стеллажей"
            class="col-3 text-center pr-1"
            :options="yesNoOptions"
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Checkbox
            v-model="form.objectClasses"
            class="col-3 pr-1"
            label="Классы"
            :options="objectClassList"
          />
          <Radio
            v-model="form.haveCranes"
            :unselectMode="true"
            label="Наличие кранов"
            class="col-3 text-center pr-1"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.heated"
            :unselectMode="true"
            label="Отапливаемый"
            class="col-3 text-center pr-1"
            :options="yesNoOptions"
          />
          <Input
            v-model="form.maxElectricity"
            placeholder="не более"
            maska="##########"
            label="Электричесвто (квт)"
            class="col-3"
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Checkbox
            v-model="form.antiDustOnly"
            class="col-2 large text-center"
            label="Только антипыль"
          />
          <Checkbox
            v-model="form.firstFloorOnly"
            class="col-2 pr-1 large text-center"
            label="Только 1 этаж"
          />
          <Checkbox
            v-model="form.expressRequest"
            class="col-2 large text-center"
            label="Срочный запрос"
          />
          <Radio
            v-model="form.trainLine"
            :unselectMode="true"
            label="Ж/Д ветка"
            class="col-2 text-center"
            :options="yesNoOptions"
          />
          <Checkbox
            v-model="form.gateTypes"
            class="col-4 pr-1"
            label="Тип ворот"
            :options="gateTypeList"
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
import Radio from "@/components/common/form/Radio.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import {
  ActivePassive,
  ObjectTypeList,
  YesNo,
  ObjectClassList,
  GateTypeList,
  DealTypeList,
} from "@/const/Const.js";
import { SearchFormMixin } from "@/components/common/mixins.js";
export default {
  mixins: [SearchFormMixin],
  name: "CompanyRequestSearchForm",
  components: {
    Form,
    FormGroup,
    Input,
    Radio,
    MultiSelect,
    CheckboxIcons,
    Checkbox,
  },
  data() {
    return {
      activePassiveOptions: ActivePassive.get("param"),
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
      yesNoOptions: YesNo.get("param"),
      objectClassList: ObjectClassList.get("param"),
      gateTypeList: GateTypeList.get("param"),
      dealTypeList: DealTypeList.get("param"),
    };
  },
  defaultFormProperties: {
    all: null,
    status: null,
    consultant_id: null,
    dateStart: null,
    dateEnd: null,
    objectTypes: [],
    rangeMinArea: null,
    rangeMaxArea: null,
    rangeMinPricePerFloor: null,
    rangeMaxPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    maxDistanceFromMKAD: null,
    water: null,
    gaz: null,
    steam: null,
    sewerage: null,
    shelving: null,
    objectClasses: [],
    haveCranes: null,
    heated: null,
    maxElectricity: null,
    antiDustOnly: null,
    expressRequest: null,
    firstFloorOnly: null,
    trainLine: null,
    gateTypes: [],
    dealType: null,
  },
  methods: {
    async setQueryFields() {
      this.form = { ...this.form, ...this.$route.query };
      if (this.form.objectClasses && !Array.isArray(this.form.objectClasses)) {
        this.form.objectClasses = [this.form.objectClasses];
      }
      if (this.form.gateTypes && !Array.isArray(this.form.gateTypes)) {
        this.form.gateTypes = [this.form.gateTypes];
      }
      if (this.form.objectTypes && !Array.isArray(this.form.objectTypes)) {
        this.form.objectTypes = [this.form.objectTypes];
      }

      let array = [];
      this.form.objectTypes.forEach((item) => {
        array.push(+item);
      });
      this.form.objectTypes = array;
      let query = { ...this.form };
      this.deleteEmptyFields(query);
      await this.$router.replace({ query });
    },
  },
};
</script>

<style>
</style>