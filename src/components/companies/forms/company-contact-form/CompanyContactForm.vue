<template>
  <div class="company-form company-request-form">
    <form @submit.prevent="submitForm">
      <Modal title="Создание запроса" @close="clickCloseModal">
        <div class="company-form-container p-3">
          <div class="main-input-list">
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label">Фамилия</label>
                <input type="text" v-model="form.middle_name" />
              </div>
              <div class="col-5 pr-2">
                <label class="input-label" title="Тип сделки">
                  Должность
                </label>
                <Multiselect
                  v-model="form.position"
                  :options="positionList"
                  :canDeselect="false"
                />
              </div>
              <div class="col-3 text-center">
                <label class="input-label d-block" title="Срочный запрос">
                  Очная встреча
                </label>
                <input
                  class="checkbox large d-block mx-auto"
                  type="checkbox"
                  v-model="form.faceToFaceMeeting"
                  title="Срочный запрос"
                />
              </div>
            </div>
            <div class="input-group row no-gutters">
              <div class="col-4 pr-2">
                <label class="input-label">Имя</label>
                <input type="text" v-model="form.middle_name" />
              </div>

              <div class="col-4 pr-2 text-center">
                <label class="input-label text-warning"> Внимание! </label>
                <input
                  class="checkbox large d-block mx-auto"
                  type="checkbox"
                  v-model="form.warning"
                />
              </div>
              <div class="col-4 text-center">
                <label class="input-label text-success">
                  Хор. взаимоотношения
                </label>
                <input
                  class="checkbox large d-block mx-auto"
                  type="checkbox"
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
              <div class="col-4 pl-2 pr-2">
                <label class="input-label">Общий телефон</label>

                <div
                  class="reproduce-input"
                  v-for="(phone, index) in form.phoneList"
                  :key="phone"
                >
                  <i
                    class="fas fa-minus left-input-icon"
                    v-if="index != 0"
                    @click="deleteTelInput(index)"
                  ></i>
                  <input
                    type="tel"
                    v-model.lazy="form.phoneList[index]"
                    v-maska="[
                      '+# (###) ###-##-##',
                      '+## (###) ###-##-##',
                      '+### (###) ###-##-##',
                    ]"
                  />
                  <i
                    class="fas fa-plus right-input-icon"
                    v-if="index == form.phoneList.length - 1"
                    @click="createNewTelInput"
                  ></i>
                </div>
              </div>
              <div class="col-4">
                <label class="input-label">Общий Email</label>

                <div
                  class="reproduce-input"
                  v-for="(item, index) in form.emailList"
                  :key="item"
                >
                  <i
                    class="fas fa-minus left-input-icon"
                    v-if="index != 0"
                    @click="deleteEmailInput(index)"
                  ></i>
                  <input type="email" v-model.lazy="form.emailList[index]" />
                  <i
                    class="fas fa-plus right-input-icon"
                    v-if="index == form.emailList.length - 1"
                    @click="createNewEmailInput"
                  ></i>
                </div>
              </div>
              <div class="col-4 text-center">
                <label class="input-label">Способ информирования</label>
                <div class="checkbox-group pb-2">
                  <div
                    class="d-inline-block mr-1"
                    v-for="way of waysToInforming"
                    :key="way[0]"
                  >
                    <input
                      class="checkbox ml-0"
                      type="checkbox"
                      v-model="form.waysToInforming"
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
          <div class="row mb-4">
            <div class="col-5 text-center m-auto">
              <input
                class="btn btn-success btn-large"
                type="submit"
                value="Создать"
              />
            </div>
          </div>
        </div>
      </Modal>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Modal from "@/components/Modal";
import { FeedbackList, PositionList } from "@/const/Const.js";
import Multiselect from "@vueform/multiselect";
export default {
  name: "CompanyRequestForm",
  components: {
    Modal,
    Multiselect,
  },
  data() {
    return {
      v$: useValidate(),
      waysToInforming: FeedbackList.get("contact"),
      positionList: PositionList.get("param"),
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        position: "",
        faceToFaceMeeting: false,
        warning: false,
        good: false,
        status: null,
        waysToInforming: [],
        consultant_id: "",
        phoneList: [""],
        emailList: [""],
      },
    };
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
      },
    };
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST"]),
    submitForm() {
      this.v$.$validate();
      console.log(this.v$.form.$error);
    },
    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
    test(event) {
      console.log(event);
    },
    createNewTelInput() {
      if (
        this.form.phoneList[this.form.phoneList.length - 1] != "" &&
        this.form.phoneList[this.form.phoneList.length - 1].length > 17
      ) {
        this.form.phoneList.push("");
      }
    },
    deleteTelInput(index) {
      this.form.phoneList = this.form.phoneList.filter(
        (item, idx) => idx != index
      );
    },
    createNewEmailInput() {
      if (this.form.emailList[this.form.emailList.length - 1] != "") {
        this.form.emailList.push("");
      }
    },
    deleteEmailInput(index) {
      this.form.emailList = this.form.emailList.filter(
        (item, idx) => idx != index
      );
    },
  },
  async mounted() {
    await this.FETCH_CONSULTANT_LIST();
  },
  emits: ["closeCompanyForm"],
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

