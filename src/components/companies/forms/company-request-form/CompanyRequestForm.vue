<template>
  <div class="fuck">
    <Modal
      :title="!formdata ? 'Создание запроса' : 'Изменение запроса'"
      @close="clickCloseModal"
      class="normal"
    >
      <Form @submit="onSubmit" class="p-2">
        <Loader class="center" v-if="loader" />
        <FormGroup class="mb-1">
          <MultiSelect
            v-model="form.regions"
            label="Регионы"
            class="col-4 pr-1"
            mode="multiple"
            :options="regionList"
          >
            <Checkbox
              v-if="form.regions.includes(1)"
              v-model="form.directions"
              class="col-12 p-0"
              label="Направления"
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
              v-if="form.regions.includes(0)"
              v-model="form.districts"
              class="col-12 p-0"
              label="Округа Москвы"
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
        <FormGroup class="mb-1">
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
              :v="v$.form.maxCeilingHeight"
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
            label="Статус"
            class="col-2 text-center"
            :options="statusOptions"
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
            label="Наличие кранов"
            class="col-3 pr-1"
            :options="haveCranesOptions"
          />
          <Radio
            v-model="form.heated"
            label="Отапливаемый"
            class="col-3 pr-1"
            :options="heatedOptions"
          />
          <Input
            v-model="form.electricity"
            maska="##########"
            label="Электричесвто (квт)"
            class="col-3"
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Checkbox
            v-model="form.gateTypes"
            class="col-6 pr-1"
            label="Тип ворот"
            :options="gateTypeList"
          />
          <Input
            v-model="form.pricePerFloor"
            maska="##########"
            label="Цена за пол (м^2/год)"
            class="col-4 pr-1"
          />
          <Radio
            v-model="form.trainLine"
            label="Ж/Д ветка"
            class="col-2 text-center"
            :options="trainLineOptions"
          >
            <Input
              v-if="form.trainLine"
              v-model="form.trainLineLength"
              label="Длина ветки"
              maska="##########"
              class="col-12 p-0"
            />
          </Radio>
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
          <Textarea v-model="form.description" class="col-6" label="Описание" />
        </FormGroup>
        <FormGroup>
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

          <CheckboxIcons
            v-model="form.objectTypes"
            label="Тип объекта"
            extraLabel="склад"
            class="col-3 pr-1"
            :options="objectTypeListWareHouse"
          />
          <CheckboxIcons
            v-model="form.objectTypes"
            extraLabel="производство"
            class="col-3 mt-4 pr-1"
            :options="objectTypeListProduction"
          />
          <CheckboxIcons
            v-model="form.objectTypes"
            extraLabel="участок"
            class="col-2 mt-4"
            :options="objectTypeListPlot"
          />
        </FormGroup>
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
import Utils from "@/utils";
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
} from "@/const/Const.js";
import Form from "@/components/form/Form.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import MultiSelect from "@/components/form/MultiSelect.vue";
import Radio from "@/components/form/Radio.vue";
import Textarea from "@/components/form/Textarea.vue";
import CheckboxIcons from "@/components/form/CheckboxIcons.vue";
import Submit from "@/components/form/Submit.vue";

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
      haveCranesOptions: YesNo.get("param"),
      statusOptions: ActivePassive.get("param"),
      heatedOptions: YesNo.get("param"),
      trainLineOptions: YesNo.get("param"),
      unknownMovingDateOptions: unknownMovingDate.get("param"),
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
        directions: [],
        districts: [],
        movingDate: null,
        unknownMovingDate: null,
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
        dealType: {
          required: helpers.withMessage("выберите тип сделки", required),
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
        maxCeilingHeight: {
          required: helpers.withMessage("Заполните поле", required),
        },
        heated: {
          required: helpers.withMessage("Выберите вариант", required),
        },
        consultant_id: {
          required: helpers.withMessage("Выберите вариант", required),
        },
        movingDate: {
          customRequiredForMovingDate: helpers.withMessage(
            "Заполните поле",
            this.customRequiredForMovingDate
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
      console.log(this.form);
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
    regionNormalize() {
      if (!this.form.regions.includes(0)) {
        this.form.districts = [];
      }
      if (!this.form.regions.includes(1)) {
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
      if (await this.CREATE_REQUEST(this.form)) {
        this.$emit("created");

        this.clickCloseModal();
      }
      this.loader = false;
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

    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
  },
  async created() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    this.form.company_id = this.company_id;
    if (this.formdata) {
      const cloneFormdata = JSON.stringify(this.formdata);
      this.form = { ...this.form, ...JSON.parse(cloneFormdata) };
      this.form = Utils.normalizeDataForRequestForm(this.form);
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
