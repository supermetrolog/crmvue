<template>
  <div class="col">
    <Loader class="center" v-if="loader" />

    <div class="row" v-if="data">
      <div class="col-12">
        <button class="btn btn-primary" v-if="!deal" @click="submitForm">
          создать сделку
        </button>
        <button class="btn btn-primary" v-else @click="submitForm">
          изменить
        </button>
      </div>
      <div class="col-12">
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
                    <label class="input-label">Юр. лицо клиента в сделке</label>
                    <input type="text" v-model.trim="form.clientLegalEntity" />
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
                    <label class="input-label">Время завершения события</label>
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
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Loader from "@/components/Loader";
import Multiselect from "@vueform/multiselect";
export default {
  name: "Deal",
  components: {
    Multiselect,
    Loader,
  },
  data() {
    return {
      data: this.step,
      loader: this.loaderForStep,
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
    step: {
      type: Object,
    },
    request_id: {
      type: Number,
    },
    loaderForStep: {
      type: [Number, Boolean],
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
    ...mapActions(["FETCH_CONSULTANT_LIST", "FETCH_COMPANY_REQUESTS"]),
    submitForm() {
      // console.log(this.deal, this.COMPANY_REQUESTS, this.v$.form.$error);
      this.v$.$validate();
      if (!this.v$.form.$error) {
        this.data.requestDealData = this.form;
        this.$emit("updateItem", this.data, false, () => {
          this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
        });
      }
    },
    setData() {
      if (this.deal) {
        this.form = { ...this.deal };
      } else {
        this.form.request_id = this.request_id;
        this.form.object_id = this.data.timelineStepObjects[0].object_id;
        this.form.complex_id = this.data.timelineStepObjects[0].complex_id;
      }
    },
  },
  async mounted() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    this.setData();
    this.loader = this.loaderForStep;
  },
  watch: {
    step() {
      this.data = this.step;
    },
    deal() {
      this.setData();
    },
    loaderForStep() {
      this.loader = this.loaderForStep;
    },
  },
  emits: ["updateItem"],
};
</script>

<style>
</style>