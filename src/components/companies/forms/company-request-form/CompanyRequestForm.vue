<template>
  <div class="fuck">
    <Modal
      :title="!formdata ? 'Создание запроса' : 'Изменение запроса'"
      @close="clickCloseModal"
      class="normal"
    >
      <Form @submit="onSubmit" class="p-2">
        <Loader class="center" v-if="loader" />
        <FormGroup class="mb-2">
          <MultiSelect
            v-model="form.regions"
            :v="v$.form.regions"
            label="Регионы"
            class="col-4 pr-1"
            mode="multiple"
            name="region"
            :options="regionList"
          >
            <small
              v-for="(region, index) in form.regions"
              :key="region.region"
              class="d-block px-3"
            >
              {{ index + 1 }}. {{ regionList[region.region].label }}
            </small>
            <Checkbox
              v-if="form.regions.find((item) => item.region == 1)"
              v-model="form.directions"
              class="col-12 p-0"
              label="Направления"
              name="direction"
              :options="directionList"
            />
          </MultiSelect>
          <MultiSelect
            v-model="form.dealType"
            :v="v$.form.dealType"
            required
            label="Тип сделки"
            class="col-4 pr-1"
            :options="dealTypeList"
          >
            <Checkbox
              v-if="form.regions.find((item) => item.region == 0)"
              v-model="form.districts"
              class="col-12 p-0"
              label="Округа Москвы"
              name="district"
              :options="districtList"
            />
          </MultiSelect>
          <MultiSelect
            v-model="form.consultant_id"
            :v="v$.form.consultant_id"
            required
            label="Консультант"
            class="col-4"
            :options="CONSULTANT_LIST"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Input
            :disabled="!!form.distanceFromMKADnotApplicable"
            v-model="form.distanceFromMKAD"
            :v="v$.form.distanceFromMKAD"
            maska="###"
            label="Удаленность от МКАД"
            class="col-4 pr-1"
            required
          >
            <Checkbox
              v-model="form.distanceFromMKADnotApplicable"
              @change="changeDistanceFromMKADnotApplicable"
              class="col-12 large p-0 pt-1"
              label="Неприменимо - регион или Москва"
              mode="inline"
            />
          </Input>

          <Input
            v-model="form.minCeilingHeight"
            :v="v$.form.minCeilingHeight"
            maska="##########"
            label="Высота потолков"
            placeholder="От:"
            required
            class="col-3 pr-1"
          >
            <Input
              v-model="form.maxCeilingHeight"
              maska="##########"
              placeholder="До:"
              required
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Input
            v-model="form.minArea"
            :v="v$.form.minArea"
            maska="##########"
            label="S пола (м^2)"
            placeholder="От:"
            required
            class="col-3 pr-1"
          >
            <Input
              v-model="form.maxArea"
              :v="v$.form.maxArea"
              maska="##########"
              placeholder="До:"
              required
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Radio
            v-model="form.status"
            required
            label="Статус"
            class="col-2 text-center"
            :options="statusOptions"
          />
          <MultiSelect
            v-if="!form.status"
            v-model="form.passive_why"
            :v="v$.form.passive_why"
            required
            label="Причина пассива"
            class="col-5 ml-auto"
            :options="passiveWhyOptions"
          >
            <Textarea
              v-model="form.passive_why_comment"
              class="col-12 p-0 pt-1"
            />
          </MultiSelect>
        </FormGroup>
        <FormGroup class="mb-2">
          <Checkbox
            v-model="form.objectClasses"
            class="col-3 pr-1"
            label="Классы"
            name="object_class"
            :options="objectClassList"
          />

          <Radio
            v-model="form.heated"
            label="Отапливаемый"
            :unselectMode="true"
            class="col-3 text-center pr-1"
            :options="yesNoOptions"
          />
          <Input
            v-model="form.electricity"
            maska="##########"
            label="Электричесвто (квт)"
            class="col-3"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Checkbox
            v-model="form.haveCranes"
            class="col large text-center"
            label="Краны"
          />
          <Checkbox
            v-model="form.water"
            class="col large text-center"
            label="Вода"
          />
          <Checkbox
            v-model="form.gaz"
            class="col large text-center"
            label="Газ"
          />
          <Checkbox
            v-model="form.steam"
            class="col large text-center"
            label="Пар"
          />
          <Checkbox
            v-model="form.sewerage"
            class="col large text-center"
            label="КНС"
          />
          <Checkbox
            v-model="form.shelving"
            class="col large text-center"
            label="Стеллажи"
          />
          <Checkbox
            v-model="form.trainLine"
            class="col large text-center"
            label="Ж/Д ветка"
          >
            <Input
              v-if="form.trainLine"
              v-model="form.trainLineLength"
              label="Длина ветки"
              maska="##########"
              class="col-12 p-0"
            />
          </Checkbox>
        </FormGroup>
        <FormGroup class="mb-2">
          <Checkbox
            v-model="form.gateTypes"
            class="col-6 pr-1"
            label="Тип ворот"
            name="gate_type"
            :options="gateTypeList"
          />
          <Input
            v-model="form.pricePerFloor"
            maska="##########"
            label="Цена за пол (м^2/год)"
            class="col-4 pr-1"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Checkbox
            v-model="form.antiDustOnly"
            class="col large text-center"
            label="Только антипыль"
          />
          <Checkbox
            v-model="form.firstFloorOnly"
            class="col pr-1 large text-center"
            label="Только 1 этаж"
          />
          <Checkbox
            v-model="form.expressRequest"
            class="col large text-center"
            label="Срочный запрос"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Input
            v-model="form.movingDate"
            :v="v$.form.movingDate"
            label="Дата переезда"
            type="date"
            required
            class="col-4 pr-1"
            @change="form.unknownMovingDate = null"
          >
            <Radio
              v-model="form.unknownMovingDate"
              class="col-12 p-0 mt-2 small"
              :options="unknownMovingDateOptions"
              @change.stop="form.movingDate = null"
            />
          </Input>
        </FormGroup>
        <FormGroup class="mb-2">
          <Checkbox
            v-model="form.objectTypesGeneral"
            :v="v$.form.objectTypesGeneral"
            class="col-12 large bg"
            label="Тип объекта"
            name="type"
            @change="changeObjectTypesGeneral"
            required
            :options="objectTypesGeneralList"
          />
        </FormGroup>

        <FormGroup>
          <CheckboxIcons
            v-model="form.objectTypes"
            class="col pr-1"
            name="object_type"
            :options="objectTypeListWareHouse"
            @change="changeObjectTypes(0)"
          />
          <CheckboxIcons
            v-model="form.objectTypes"
            class="col pr-1"
            name="object_type"
            :options="objectTypeListProduction"
            @change="changeObjectTypes(1)"
          />
          <CheckboxIcons
            v-model="form.objectTypes"
            class="col"
            name="object_type"
            :options="objectTypeListPlot"
            @change="changeObjectTypes(2)"
          />
        </FormGroup>
        <Textarea
          v-model="form.description"
          class="col-12 px-0"
          label="Описание"
        />
        <FormGroup> </FormGroup>
        <FormGroup class="mt-4">
          <Submit class="col-4 mx-auto">
            {{ formdata ? "Сохранить" : "Создать" }}
          </Submit>
        </FormGroup>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import {
  ObjectClassList,
  GateTypeList,
  ObjectTypeList,
  RegionList,
  DirectionList,
  DistrictList,
  DealTypeList,
  YesNo,
  ActivePassive,
  unknownMovingDate,
  PassiveWhyRequest,
  ObjectTypesGeneralList,
} from "@/const/Const.js";
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import Radio from "@/components/common/form/Radio.vue";
import Textarea from "@/components/common/form/Textarea.vue";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
import Submit from "@/components/common/form/Submit.vue";
import moment from "moment";

export default {
  name: "CompanyRequestForm",
  components: {
    Form,
    FormGroup,
    Input,
    Checkbox,
    MultiSelect,
    Radio,
    Textarea,
    CheckboxIcons,
    Submit,
  },
  data() {
    return {
      v$: useValidate(),
      objectClassList: ObjectClassList.get("param"),
      gateTypeList: GateTypeList.get("param"),
      objectTypesGeneralList: ObjectTypesGeneralList.get("param"),
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
      regionList: RegionList.get("param"),
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      dealTypeList: DealTypeList.get("param"),
      productionTypeListVisible: true,
      warehouseTypeListVisible: true,
      plotTypeListVisible: true,
      isOpenDealTypeSelect: false,
      isOpenConsultantSelect: false,
      yesNoOptions: YesNo.get("param"),
      statusOptions: ActivePassive.get("param"),
      unknownMovingDateOptions: unknownMovingDate.get("param"),
      passiveWhyOptions: PassiveWhyRequest.get("param"),
      loader: false,
      form: {
        company_id: null,
        id: null,
        dealType: null,
        regions: [],
        expressRequest: null,
        distanceFromMKAD: null,
        distanceFromMKADnotApplicable: null,
        minArea: null,
        maxArea: null,
        minCeilingHeight: null,
        maxCeilingHeight: null,
        firstFloorOnly: null, ///
        objectClasses: [],
        heated: null,
        gateTypes: [],
        antiDustOnly: null,
        electricity: "",
        haveCranes: null,
        trainLine: null,
        trainLineLength: null,
        status: 1, //default
        consultant_id: null,
        description: null,
        pricePerFloor: null,
        objectTypes: [],
        objectTypesGeneral: [],
        directions: [],
        districts: [],
        movingDate: null,
        unknownMovingDate: null,
        passive_why: null,
        passive_why_comment: null,
        water: null,
        gaz: null,
        steam: null,
        sewerage: null,
        shelving: null,
      },
    };
  },
  props: {
    formdata: {
      type: Object,
      default: null,
    },
    company_id: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["CONSULTANT_LIST"]),
  },
  validations() {
    return {
      form: {
        regions: {
          required: helpers.withMessage("выберите регион", required),
        },
        dealType: {
          required: helpers.withMessage("выберите тип сделки", required),
        },
        objectTypesGeneral: {
          required: helpers.withMessage("выберите тип объекта", required),
        },
        distanceFromMKAD: {
          customRequired: helpers.withMessage(
            "Заполните поле",
            this.customRequired
          ),
        },
        minArea: {
          required: helpers.withMessage("Заполните поле", required),
        },
        maxArea: {
          required: helpers.withMessage("Заполните поле", required),
        },
        minCeilingHeight: {
          required: helpers.withMessage("Заполните поле", required),
        },
        consultant_id: {
          required: helpers.withMessage("Выберите вариант", required),
        },
        movingDate: {
          customRequiredForMovingDate: helpers.withMessage(
            "Заполните поле",
            this.customRequiredForMovingDate
          ),
          maxValue: helpers.withMessage(
            "Неверная дата",
            this.dateRangeValidator
          ),
        },
        passive_why: {
          customRequiredPassiveWhy: helpers.withMessage(
            "Выберите причину",
            this.customRequiredPassiveWhy
          ),
        },
      },
    };
  },
  methods: {
    ...mapActions([
      "FETCH_CONSULTANT_LIST",
      "CREATE_REQUEST",
      "UPDATE_REQUEST",
    ]),
    async onSubmit() {
      this.v$.$validate();
      if (!this.v$.form.$error) {
        this.regionNormalize();
        this.loader = true;
        if (this.formdata) {
          this.updateRequest();
        } else {
          this.createRequest();
        }
      }
    },
    changeDistanceFromMKADnotApplicable() {
      if (this.form.distanceFromMKADnotApplicable) {
        this.form.distanceFromMKAD = null;
      }
    },
    regionNormalize() {
      if (!this.form.regions.find((item) => item.region == 0)) {
        this.form.districts = [];
      }
      if (!this.form.regions.find((item) => item.region == 1)) {
        this.form.directions = [];
      }
    },
    async updateRequest() {
      if (await this.UPDATE_REQUEST(this.form)) {
        this.$emit("updated");
        this.clickCloseModal();
      }
      this.loader = false;
    },
    async createRequest() {
      console.log("CREATE");
      if (await this.CREATE_REQUEST(this.form)) {
        this.$emit("created");

        this.clickCloseModal();
      }
      this.loader = false;
    },
    dateRangeValidator(value) {
      if (value === null) return true;

      let min = Date.parse(moment(new Date()).format("YYYY-MM-DD"));

      const max = Date.parse(new Date("2030-12-29"));
      const current = Date.parse(new Date(value));
      if (this.formdata) {
        min = Date.parse(new Date(this.formdata.movingDate));
      }
      console.log(min, current);
      if (current >= min && current < max) {
        return true;
      }
      return false;
    },
    customRequired(value) {
      if (!this.form.distanceFromMKADnotApplicable) {
        if (value != null) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    customRequiredPassiveWhy() {
      if (this.form.status) {
        return true;
      }
      if (!required.$validator(this.form.passive_why)) {
        return false;
      }
      return true;
    },
    customRequiredForMovingDate(value) {
      if (this.form.unknownMovingDate === null) {
        if (value != null) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    diff(list) {
      let options = [];
      list.forEach((item) => {
        options.push(item[0]);
      });
      let data = [];

      this.form.objectTypes.forEach((item) => {
        if (!options.includes(item.object_type)) {
          data.push(item);
        }
      });
      console.warn(data);
      return data;
    },
    changeObjectTypesGeneral(data) {
      let warehouse,
        production,
        plot = null;
      console.error("DATA", data);
      data.forEach((item) => {
        if (item == 0) {
          warehouse = 1;
        } else if (item == 1) {
          production = 1;
        } else if (item == 2) {
          plot = 1;
        }
      });
      if (warehouse == null)
        this.form.objectTypes = this.diff(this.objectTypeListWareHouse);

      if (production == null)
        this.form.objectTypes = this.diff(this.objectTypeListProduction);

      if (plot == null)
        this.form.objectTypes = this.diff(this.objectTypeListPlot);
    },

    changeObjectTypes(objectTypeGeneral) {
      this.form.objectTypesGeneral = this.form.objectTypesGeneral.filter(
        (item) => item.type != objectTypeGeneral
      );
      this.form.objectTypesGeneral.push({ type: objectTypeGeneral });
    },
    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
  },
  async created() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    this.form.company_id = this.company_id;
    if (this.formdata) {
      this.form = { ...this.form, ...this.formdata };
    }
    console.log("FORM: ", this.form);
    this.loader = false;
  },
  watch: {
    form: {
      deep: true,
      handler() {
        console.log("FORM:", this.form);
      },
    },
  },
  emits: ["closeCompanyForm", "created", "updated"],
};
</script>
