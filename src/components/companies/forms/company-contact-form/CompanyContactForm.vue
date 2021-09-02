<template>
  <div class="company-form company-contact-form">
    <Modal title="Создание запроса" @close="clickCloseModal">
      <form @submit.prevent="submitForm">
        <div class="company-form-container p-3">
          <Loader class="center" v-if="loader" />

          <div class="main-input-list">
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label">Фамилия</label>
                <input type="text" v-model="form.middle_name" />
              </div>
              <div class="col-4 pr-2">
                <label class="input-label" title="Тип сделки">
                  Должность
                </label>
                <Multiselect
                  v-model="form.position"
                  :options="positionList"
                  :canDeselect="false"
                />
              </div>
              <div class="col-4 pr-2 text-center">
                <label class="input-label"> Статус </label>
                <div class="checkbox-group pb-2">
                  <input
                    class="checkbox m-auto"
                    type="radio"
                    v-model="form.status"
                    value="1"
                    id="radio-status-0"
                  />
                  <label class="checkbox-label" for="radio-status-0">
                    актив
                  </label>
                  <input
                    class="checkbox"
                    type="radio"
                    v-model="form.status"
                    value="0"
                    id="radio-status-1"
                  />
                  <label class="checkbox-label" for="radio-status-1">
                    пассив
                  </label>
                </div>
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label required">Имя</label>
                <input
                  type="text"
                  v-model="form.first_name"
                  @input="v$.form.first_name.$touch"
                  :class="{
                    invalid: v$.form.first_name.$error,
                    valid:
                      v$.form.first_name.$dirty && !v$.form.first_name.$error,
                  }"
                />
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.first_name.$error"
                >
                  <span>{{ v$.form.first_name.$errors[0].$message }}</span>
                </div>
              </div>

              <div class="col-4 pr-2 text-center">
                <label class="input-label text-warning"> Внимание! </label>
                <input
                  class="checkbox large d-block mx-auto"
                  type="radio"
                  @click="form.warning ? (form.warning = null) : ''"
                  value="1"
                  v-model="form.warning"
                />
              </div>
              <div class="col-4 text-center">
                <label class="input-label text-success">
                  Хор. взаимоотношения
                </label>
                <input
                  class="checkbox large d-block mx-auto"
                  type="radio"
                  value="1"
                  @click="form.good ? (form.good = null) : ''"
                  v-model="form.good"
                />
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label">Отчество</label>
                <input type="text" v-model="form.last_name" />
              </div>

              <div class="col-4 pr-2 text-center">
                <label class="input-label d-block" title="Срочный запрос">
                  Очная встреча
                </label>
                <input
                  class="checkbox large d-block mx-auto"
                  @click="
                    form.faceToFaceMeeting
                      ? (form.faceToFaceMeeting = null)
                      : ''
                  "
                  v-model="form.faceToFaceMeeting"
                  type="radio"
                  value="1"
                  title="Очная встреча"
                />
              </div>
              <div class="col-4">
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
                  <span>{{ v$.form.consultant_id.$errors[0].$message }}</span>
                </div>
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label">Общий телефон</label>

                <div
                  class="reproduce-input"
                  v-for="(phone, index) in form.phones"
                  :key="index"
                >
                  <i
                    class="fas fa-minus left-input-icon"
                    v-if="index != 0"
                    @click="deleteTelInput(index)"
                  ></i>
                  <input
                    type="tel"
                    v-model.lazy="form.phones[index]"
                    @input="v$.form.emails.$touch"
                    v-maska="[
                      '+# (###) ###-##-##',
                      '+## (###) ###-##-##',
                      '+### (###) ###-##-##',
                    ]"
                  />
                  <i
                    class="fas fa-plus right-input-icon"
                    v-if="index == form.phones.length - 1"
                    @click="createNewTelInput"
                  ></i>
                </div>
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.emails.$error"
                >
                  <span>{{ v$.form.emails.$errors[0].$message }}</span>
                </div>
              </div>
              <div class="col-4">
                <label class="input-label">Общий Email</label>

                <div
                  class="reproduce-input"
                  v-for="(item, index) in form.emails"
                  :key="index"
                >
                  <i
                    class="fas fa-minus left-input-icon"
                    v-if="index != 0"
                    @click="deleteEmailInput(index)"
                  ></i>
                  <input type="email" v-model.lazy="form.emails[index]" />
                  <i
                    class="fas fa-plus right-input-icon"
                    v-if="index == form.emails.length - 1"
                    @click="createNewEmailInput"
                  ></i>
                </div>
                <div
                  class="col-12 text-center error-container pt-1 pb-0"
                  v-if="v$.form.emails.$error"
                >
                  <span>{{ v$.form.emails.$errors[0].$message }}</span>
                </div>
              </div>
              <div class="col-4 text-center">
                <label class="input-label">Способ информирования</label>
                <div class="checkbox-group pb-2">
                  <div
                    class="d-inline-block mr-1"
                    v-for="way of wayOfInformings"
                    :key="way[0]"
                  >
                    <input
                      class="checkbox ml-0"
                      type="checkbox"
                      v-model="form.wayOfInformings"
                      :value="way[0]"
                      :id="'checkbox-gate-type' + way[0]"
                    />
                    <label
                      class="checkbox-label"
                      :for="'checkbox-gate-type' + way[0]"
                      >{{ way[1] }}</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-3 mt-4">
            <div class="col-5 text-center m-auto">
              <input
                v-if="!formdata"
                class="btn btn-success btn-large"
                type="submit"
                value="Создать"
              />
              <input
                v-else
                class="btn btn-success btn-large"
                type="submit"
                value="Сохранить изменения"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import { FeedbackList, PositionList } from "@/const/Const.js";
import Multiselect from "@vueform/multiselect";
import Utils from "@/utils";
export default {
  name: "CompanyRequestForm",
  components: {
    Modal,
    Multiselect,
    Loader,
  },
  data() {
    return {
      v$: useValidate(),
      wayOfInformings: FeedbackList.get("contact"),
      positionList: PositionList.get("param"),
      loader: false,
      form: {
        first_name: null,
        middle_name: null,
        last_name: null,
        position: null,
        faceToFaceMeeting: 0,
        warning: 0,
        good: 0,
        status: 1,
        wayOfInformings: [],
        consultant_id: null,
        phones: [""],
        emails: [""],
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
        consultant_id: {
          required: helpers.withMessage("выберите консультанта", required),
        },
        first_name: {
          required: helpers.withMessage("введите имя", required),
        },
        emails: {
          customRequired: helpers.withMessage(
            "дабавьте либо телефон либо email",
            this.customRequired
          ),
        },
      },
    };
  },
  methods: {
    ...mapActions([
      "FETCH_CONSULTANT_LIST",
      "CREATE_CONTACT",
      "UPDATE_CONTACT",
    ]),
    async submitForm() {
      this.v$.$validate();
      if (!this.v$.form.$error) {
        this.loader = true;
        this.normalizePhones();
        this.normalizeEmails();
        if (this.formdata) {
          this.updateContact();
        } else {
          this.createContact();
        }
      }
    },
    async updateContact() {
      if (await this.UPDATE_CONTACT(this.form)) {
        this.$emit("updated");
        this.loader = false;
        this.clickCloseModal();
      }
    },
    async createContact() {
      if (await this.CREATE_CONTACT(this.form)) {
        this.$emit("created");
        this.loader = false;

        this.clickCloseModal();
      }
    },
    customRequired() {
      if (this.form.emails.length == 1 && this.form.phones.length == 1) {
        if (this.form.emails[0] == "" && this.form.phones[0] == "") {
          return false;
        }
      }
      return true;
    },
    normalizePhones() {
      this.form.phones = this.form.phones.filter((item) => item != "");
    },
    normalizeEmails() {
      this.form.emails = this.form.emails.filter((item) => item != "");
    },
    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
    createNewTelInput() {
      if (
        this.form.phones[this.form.phones.length - 1] != "" &&
        this.form.phones[this.form.phones.length - 1].length > 17
      ) {
        this.form.phones.push("");
      }
    },
    deleteTelInput(index) {
      this.form.phones = this.form.phones.filter((item, idx) => idx != index);
    },
    createNewEmailInput() {
      if (this.form.emails[this.form.emails.length - 1] != "") {
        this.form.emails.push("");
      }
    },
    deleteEmailInput(index) {
      this.form.emails = this.form.emails.filter((item, idx) => idx != index);
    },
  },
  async mounted() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    if (this.formdata) {
      this.form = Utils.normalizeDataForContactForm(this.formdata);
      console.log(this.form);
    } else {
      this.form.company_id = this.company_id;
    }
    this.loader = false;
  },
  emits: ["closeCompanyForm", "updated", "created"],
};
</script>
/*
Запрос открыт только работающему брокеру (открывается если брокер предложил другому брокеру этот запрос)
Запрос: Беру в работу, Отказаться совсем, Предложить другому брокеру (Эта кнопка должна быть всегда).
Через пол года бездействий закрывается запрос
После перехода к другому брокеру ветка закрывается и создается новая
Если возвращаем к предыдущему брокеру ветка открывается 

Возможность закрытия запроса брокером: 
    - на любом этапе
    - запрос может закрыть только администратор 
    - должна быть кнопка (хочу закрыть запрос + обязательный комментарий) - поступает администратору и так решает закрывать или нет или предложить другому или вести самому его до 5 шага потом надо передать брокеру
    - администратор может отправлять модератору спорные запросы (он либо перепоручает запрос либо закрывает его)

Знакомство: 
    Интервал на жизнь знакомства - до полу года, если он не перешел к этапу 3.
    Если не пошел дальше - пол года

    Если не познакомился в течение после поступления

Условия:
    Если не прошел шаг 1 (Знакомства) - не созвонился, не дозвонился
        - уведомлять ежедневно о том что надо позвонить
    
*/

