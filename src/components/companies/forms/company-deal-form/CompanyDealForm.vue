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
import Textarea from "@/components/form/Textarea.vue";
import MultiSelect from "@/components/form/MultiSelect.vue";
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
  },
  data() {
    return {
      loader: false,
      v$: useValidate(),
      selectedCompany: null,
      selectedRequest: null,
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
      this.loader = true;
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
      this.loader = false;
      return array;
    },
    async searchRequest(query) {
      this.loader = true;
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
      this.loader = false;
      return array;
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