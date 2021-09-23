<template>
  <div class="offer-objects">
    <div class="row no-gutters mb-3 p-0">
      <div class="col-3 pr-1">
        <button class="btn btn-primary btn-large" @click.prevent="submitForm">
          создать
        </button>
      </div>
    </div>
    <div class="row no-gutters inner scroller">
      <Loader class="center" v-if="loader" />

      <div class="col-12">
        <div class="row no-gutters">
          <div class="col-12 pl-2">
            <div class="company-form">
              <form @submit.prevent>
                <div class="company-form-container">
                  <div class="main-input-list">
                    <div class="input-group row no-gutters">
                      <div class="col-6 pr-2">
                        <label class="input-label">Название</label>
                        <input type="text" v-model.trim="form.name" />
                      </div>
                      <div class="col-6">
                        <label class="input-label">Площадь сделки</label>
                        <input
                          type="text"
                          v-model.number="form.area"
                          v-maska="'##########'"
                        />
                      </div>
                    </div>

                    <div class="input-group row no-gutters">
                      <div class="col-6 pr-2">
                        <label class="input-label"
                          >Юр. лицо клиента в сделке</label
                        >
                        <input
                          type="text"
                          v-model.trim="form.clientLegalEntity"
                        />
                      </div>
                      <div class="col-6">
                        <label class="input-label">Цена пола</label>
                        <input
                          type="text"
                          v-model.number="form.floorPrice"
                          v-maska="'##############'"
                        />
                      </div>
                    </div>
                    <div class="input-group row no-gutters">
                      <div class="col-6 pr-2">
                        <label class="input-label">Время начала события</label>
                        <input type="date" v-model="form.endEventTime" />
                      </div>
                      <div class="col-6">
                        <label class="input-label"
                          >Время завершения события</label
                        >
                        <input type="date" v-model="form.startEventTime" />
                      </div>
                    </div>
                    <div class="input-group row no-gutters">
                      <div class="col-6 pr-2">
                        <label class="input-label">Описание</label>
                        <textarea type="text" v-model.trim="form.description" />
                      </div>
                      <div class="col-6">
                        <label class="input-label required" title="Тип сделки">
                          Консультант
                        </label>
                        <Multiselect
                          v-model="form.consultant_id"
                          :options="this.CONSULTANT_LIST"
                          :canDeselect="false"
                          @change="v$.form.consultant_id.$touch"
                          :class="{
                            invalid: v$.form.consultant_id.$error,
                            valid:
                              v$.form.consultant_id.$dirty &&
                              !v$.form.consultant_id.$error,
                          }"
                        />
                        <div
                          class="col-12 text-center error-container pt-1 pb-0"
                          v-if="v$.form.consultant_id.$error"
                        >
                          <span>{{
                            v$.form.consultant_id.$errors[0].$message
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 px-2" v-if="currentStepObjects.length">
        <p>Предложение, по которому произошла сделка</p>
      </div>
      <ObjectsItem
        v-for="object in currentStepObjects"
        :object="object"
        :selectedObjects="selectedObjects"
        :key="object.id"
        :classList="'success'"
        @selectObject="$emit('selectObjectOne', object)"
        @unSelectObject="$emit('unSelectObject', object)"
      />
      <div class="col-12 px-2 mt-3">
        <hr />
        <p>Предложения, по которым планировались переговоры</p>
      </div>

      <ObjectsItem
        v-for="object in allObjects"
        :object="object"
        :selectedObjects="selectedObjects"
        :key="object.id"
        :classList="
          currentStepObjects.find((item) => item.id == object.id)
            ? 'success'
            : ''
        "
        @selectObject="$emit('selectObjectOne', object)"
        @unSelectObject="$emit('unSelectObject', object)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Loader from "@/components/Loader";
import Multiselect from "@vueform/multiselect";
import ObjectsItem from "@/components/companies/objects/ObjectsItem.vue";

export default {
  name: "CompanyRequestForm",
  components: {
    Multiselect,
    Loader,
    ObjectsItem,
  },
  data() {
    return {
      v$: useValidate(),
      form: {
        request_id: null,
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
    loader: {
      type: Boolean,
    },
    formdata: {
      type: Object,
      default: null,
    },
    request_id: {
      type: Number,
      default: null,
    },
    selectedObjects: {
      type: Array,
      default() {
        return [];
      },
    },
    currentStepObjects: {
      type: Array,
      default() {
        return [];
      },
    },
    allObjects: {
      type: Array,
      default() {
        return [];
      },
    },
    selectedStepNumber: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters(["CONSULTANT_LIST", "COMPANY_REQUESTS"]),
    deal() {
      return this.COMPANY_REQUESTS.find((item) => item.id == this.request_id)
        .deal;
    },
  },
  validations() {
    return {
      form: {
        consultant_id: {
          required: helpers.withMessage("выберите консультанта", required),
        },
      },
    };
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST"]),
    submitForm() {
      this.v$.$validate();
      if (!this.v$.form.$error) {
        this.$emit("submitDeal", this.form);
      }
    },
  },
  async mounted() {
    await this.FETCH_CONSULTANT_LIST();
    if (this.deal) {
      this.form = { ...this.deal };
    } else {
      this.form.request_id = this.request_id;
    }
  },
  emits: [
    "submitDeal",
    "sendObjects",
    "clickResetSelectObjects",
    "selectObjectOne",
    "unSelectObject",
  ],
};
</script>

//FTP pass Studentjke2-h
// login billypro_front