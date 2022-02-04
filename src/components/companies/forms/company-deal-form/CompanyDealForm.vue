<template>
  <div class="company-deal-form">
    <Modal
      :title="formdata ? 'Редактирование сделки' : 'Создание сделки'"
      @close="$emit('close')"
      classes="autosize"
    >
      <Loader class="center" v-if="loader" />
      <Form @submit="onSubmit" class="center">
        <FormGroup class="mb-1">
          <Checkbox
            v-if="!isOurDeal"
            v-model="form.is_our"
            label="Наша сделка?"
            class="col-2 large"
          />
          <MultiSelect
            v-if="!form.is_our"
            v-model="form.competitor_company_id"
            extraClasses="long-text"
            label="Компания конкурент"
            required
            class="col-5 px-1"
            :filterResults="false"
            :minChars="1"
            :resolveOnLoad="true"
            :delay="0"
            :searchable="true"
            :options="
              async (query) => {
                return await searchCompetitorCompany(query);
              }
            "
          />
          <ObjectsInput
            v-model="form.object_id"
            :v="v$.form.object_id"
            @selectItem="selectObject"
            required
            label="Объект"
            class="ml-auto"
            :type_id="form.type_id"
            :class="{
              'col-5': !form.is_our,
              'col-6': form.is_our,
              'ml-auto': form.is_our,
              'mx-auto': !form.is_our,
            }"
            :options="
              async (query) => {
                return await searchObjects(query);
              }
            "
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Input v-model="form.name" label="Название" class="col-6 pr-1" />
          <Input
            v-model="form.area"
            label="Площадь сделки"
            class="col-6"
            maska="##########"
          />
          <MultiSelect
            v-model="form.company_id"
            extraClasses="long-text"
            label="Компания"
            required
            class="col-6 pr-1"
            :v="v$.form.company_id"
            :filterResults="false"
            :minChars="1"
            :resolveOnLoad="true"
            :delay="0"
            :searchable="true"
            :options="
              async (query) => {
                return await searchCompany(query);
              }
            "
          />
          <MultiSelect
            v-model="form.request_id"
            extraClasses="long-text"
            label="Запрос"
            class="col-6"
            :filterResults="false"
            :minChars="1"
            :resolveOnLoad="true"
            :delay="0"
            :searchable="true"
            :options="
              async (query) => {
                return await searchRequest(query);
              }
            "
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Input
            v-model="form.clientLegalEntity"
            label="Юр. лицо клиента в сделке"
            class="col-6 pr-1"
          />
          <Input
            v-model="form.floorPrice"
            label="Цена пола"
            class="col-6"
            maska="##########"
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <MultiSelect
            v-model="form.consultant_id"
            :v="v$.form.consultant_id"
            required
            label="Консультант"
            class="col-6 pr-1"
            :options="CONSULTANT_LIST"
          />
          <Textarea v-model="form.description" label="Описание" class="col-6" />
        </FormGroup>
        <FormGroup class="mb-1">
          <Input
            v-model="form.startEventTime"
            label="Время начала события"
            type="date"
            class="col-6 pr-1"
          />
          <Input
            v-model="form.endEventTime"
            label="Время завершения события"
            type="date"
            class="col-6"
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
import { mapActions, mapGetters } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Form from "@/components/form/Form.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import Input from "@/components/form/Input.vue";
import ObjectsInput from "@/components/form/ObjectsInput.vue";
import Textarea from "@/components/form/Textarea.vue";
import MultiSelect from "@/components/form/MultiSelect.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Submit from "@/components/form/Submit.vue";
import api from "@/api/api";
import { DealTypeList } from "@/const/Const.js";
export default {
  name: "CompanyDealForm",
  components: {
    Form,
    FormGroup,
    Input,
    Textarea,
    MultiSelect,
    Submit,
    Checkbox,
    ObjectsInput,
  },
  data() {
    return {
      loader: false,
      v$: useValidate(),
      selectedCompany: null,
      selectedRequest: null,
      selectedCompetitorCompany: null,
      form: {
        request_id: null,
        company_id: null,
        consultant_id: null,
        name: null,
        area: null,
        floorPrice: null,
        clientLegalEntity: null,
        description: null,
        startEventTime: null,
        endEventTime: null,
        is_our: 1,
        is_competitor: 0,
        competitor_company_id: null,
        complex_id: null,
        object_id: null,
        type_id: null,
      },
    };
  },

  props: {
    formdata: {
      type: Object,
    },
    request_id: {
      type: Number,
    },
    company_id: {
      type: Number,
    },
    object_id: {
      type: Number,
    },
    complex_id: {
      type: Number,
    },
    type_id: {
      type: Number,
    },
    isOurDeal: {
      type: Boolean,
      default: false,
    },
  },
  validations() {
    return {
      form: {
        consultant_id: {
          required: helpers.withMessage("выберите консультанта", required),
        },
        company_id: {
          required: helpers.withMessage("заполните поле", required),
        },
        object_id: {
          required: helpers.withMessage("выберите предложение", () => {
            if (
              this.form.object_id &&
              this.form.complex_id &&
              this.form.type_id
            ) {
              return true;
            }
            return false;
          }),
        },
        type_id: {
          required: helpers.withMessage("выберите предложение", required),
        },
        complex_id: {
          required: helpers.withMessage("выберите предложение", required),
        },
      },
    };
  },
  computed: {
    ...mapGetters(["CONSULTANT_LIST"]),
  },
  methods: {
    ...mapActions([
      "FETCH_CONSULTANT_LIST",
      "CREATE_DEAL",
      "UPDATE_DEAL",
      "SEARCH_COMPANIES",
      "SEARCH_REQUESTS",
      "CREATE_DEAL",
      "UPDATE_DEAL",
      "SEARCH_OBJECTS",
    ]),
    onSubmit() {
      this.v$.$validate();
      if (!this.v$.form.$error) {
        this.loader = true;
        if (this.formdata) {
          this.update();
        } else {
          this.create();
        }
      }
    },
    async update() {
      if (await this.UPDATE_DEAL(this.form)) {
        this.$emit("updated", this.form);
        this.clickCloseModal();
      }
      this.loader = false;
    },
    async create() {
      if (await this.CREATE_DEAL(this.form)) {
        this.$emit("created", this.form);
        this.clickCloseModal();
      }
      this.loader = false;
    },
    clickCloseModal() {
      this.$emit("close");
    },
    async searchCompany(query) {
      let result = null;
      let array = [];
      if (this.formdata || this.company_id) {
        if (!this.selectedCompany) {
          this.selectedCompany = await api.companies.getCompany(
            this.formdata ? this.formdata.company_id : this.company_id
          );
        }

        array.push({
          value: this.selectedCompany.id,
          label:
            this.selectedCompany.nameRu + " " + this.selectedCompany.nameEng,
        });
      }
      result = await this.SEARCH_COMPANIES({
        query: { searchText: query },
        saveState: false,
      });
      result.forEach((item) => {
        array.push({ value: item.id, label: item.nameRu + " " + item.nameEng });
      });
      return array;
    },
    async searchCompetitorCompany(query) {
      let result = null;
      let array = [];
      if (this.formdata || this.competitor_company_id) {
        if (!this.selectedCompany) {
          this.selectedCompetitorCompany = await api.companies.getCompany(
            this.formdata ? this.formdata.company_id : this.company_id
          );
        }

        array.push({
          value: this.selectedCompetitorCompany.id,
          label:
            this.selectedCompetitorCompany.nameRu +
            " " +
            this.selectedCompetitorCompany.nameEng,
        });
      }
      result = await this.SEARCH_COMPANIES({
        query: { searchText: query },
        saveState: false,
      });
      result.forEach((item) => {
        array.push({ value: item.id, label: item.nameRu + " " + item.nameEng });
      });
      return array;
    },
    async searchRequest(query) {
      let result = null;
      let array = [];
      if (this.formdata || this.request_id) {
        if (!this.selectedRequest) {
          this.selectedRequest = await api.request.getRequest(
            this.formdata ? this.formdata.request_id : this.request_id
          );
        }
        console.log("REQUEST", this.selectedRequest);
        array.push({
          value: this.selectedRequest.id,
          label:
            DealTypeList.get("param")[this.selectedRequest[0].dealType].label +
            " " +
            this.selectedRequest.minArea +
            " " +
            this.selectedRequest.maxArea +
            "м^2",
        });
      }
      result = await this.SEARCH_REQUESTS({ searchText: query });
      result.forEach((item) => {
        array.push({
          value: item.id,
          label:
            DealTypeList.get("param")[item.dealType].label +
            " " +
            item.minArea +
            "-" +
            item.maxArea +
            " м^2",
        });
      });
      return array;
    },
    async searchObjects(query) {
      let result = null;
      let array = [];
      result = await this.SEARCH_OBJECTS({
        query: { searchText: query },
        saveState: false,
      });
      result.forEach((item) => {
        array.push({
          value: item.original_id,
          label: item.deal_type_name,
          icon: item.building.photos,
          info: item,
        });
      });
      console.error(array);
      return array;
    },
    selectObject(complex_id, type_id) {
      this.form.complex_id = complex_id;
      this.form.type_id = type_id;
    },
  },
  async mounted() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    this.form.request_id = this.request_id;
    console.log("ID", this.request_id);
    this.form.company_id = this.company_id;

    if (this.formdata) {
      this.form = { ...this.form, ...this.formdata };
    }
    this.form.object_id = this.object_id;
    this.form.complex_id = this.complex_id;
    this.form.type_id = this.type_id;
    this.loader = false;
  },
  watch: {
    form: {
      handler() {
        console.log("FORM: ", this.form);
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>