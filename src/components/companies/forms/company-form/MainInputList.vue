<template>
  <div class="main-input-list">
    <div class="input-group row no-gutters" v-if="!this.MAIN.noName">
      <div class="col-4">
        <label class="input-label">Название Eng</label>
      </div>
      <div class="col-8">
        <div class="row no-gutters">
          <div class="col-12">
            <input
              :class="{
                invalid: v.nameEng.$error,
                valid: v.nameEng.$dirty && !v.nameEng.$error,
              }"
              type="text"
              @input="v.nameEng.$touch"
              v-model.trim="this.MAIN.nameEng"
            />
          </div>
          <div class="col-12 text-center error-container pt-1 pb-0">
            <span v-if="v.nameEng.$error">{{
              v.nameEng.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="input-group row no-gutters" v-if="!this.MAIN.noName">
      <div class="col-4">
        <label class="input-label">Название Ru</label>
      </div>
      <div class="col-8">
        <div class="row no-gutters">
          <div class="col-12">
            <input
              :class="{
                invalid: v.nameRu.$error,
                valid: v.nameRu.$dirty && !v.nameRu.$error,
              }"
              @input="v.nameRu.$touch"
              type="text"
              v-model.trim="this.MAIN.nameRu"
            />
          </div>
          <div class="col-12 text-center error-container pt-1 pb-0">
            <span v-if="v.nameRu.$error">{{
              v.nameRu.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Нет названия</label>
      </div>
      <div class="col-8">
        <input
          class="checkbox middle"
          type="checkbox"
          @change="setDefaultName"
          v-model="this.MAIN.noName"
        />
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Форма органиизации</label>
      </div>
      <div class="col-8">
        <select v-model="this.MAIN.formOfOrganization">
          <option value="0">не выбрано</option>
          <option value="1">OOO</option>
          <option value="2">OAO</option>
        </select>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Входит в ГК</label>
      </div>
      <div class="col-8">
        <input type="text" v-model.trim="this.MAIN.companyGroup" />
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Категория</label>
      </div>
      <div class="col-8">
        <div class="row no-gutters">
          <div class="col-12">
            <div class="checkbox-group">
              <input
                class="checkbox"
                type="checkbox"
                v-model="this.MAIN.category"
                value="0"
                id="checkbox-0"
              />
              <label class="checkbox-label" for="checkbox-0">клиент</label>
              <input
                class="checkbox"
                type="checkbox"
                v-model="this.MAIN.category"
                value="1"
                id="checkbox-1"
              />
              <label class="checkbox-label" for="checkbox-1">посредник</label>
              <input
                class="checkbox"
                type="checkbox"
                v-model="this.MAIN.category"
                value="2"
                id="checkbox-2"
              />
              <label class="checkbox-label" for="checkbox-2">мониторинг</label>
              <br />
              <input
                class="checkbox"
                type="checkbox"
                v-model="this.MAIN.category"
                value="3"
                id="checkbox-3"
              />
              <label class="checkbox-label" for="checkbox-3">собственник</label>
              <input
                class="checkbox"
                type="checkbox"
                v-model="this.MAIN.category"
                value="4"
                id="checkbox-4"
              />
              <label class="checkbox-label" for="checkbox-4">оценщик</label>
              <input
                class="checkbox"
                type="checkbox"
                v-model="this.MAIN.category"
                value="5"
                id="checkbox-5"
              />
              <label class="checkbox-label" for="checkbox-5">подрядчик</label>
            </div>
          </div>
          <div class="col-12 text-center error-container pt-1 pb-0">
            <span v-if="v.category.$error">{{
              v.category.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Адрес офиса</label>
      </div>
      <div class="col-8">
        <input type="text" v-model.trim="this.MAIN.officeAdress" />
      </div>
    </div>
    <div
      class="input-group row no-gutters"
      v-for="(item, index) in this.MAIN.siteList"
      :key="item"
    >
      <div class="col-4">
        <label class="input-label" v-if="!index">Вебсайт</label>
        <label class="input-label" v-else></label>
      </div>
      <div class="col-8 reproduce-input">
        <i
          class="fas fa-minus left-input-icon"
          v-if="index != 0"
          @click="deleteSiteInput(index)"
        ></i>
        <input
          type="url"
          v-model.lazy="this.MAIN.siteList[index]"
          v-maska="{
            mask: 'http://H*#*!*',
            tokens: { H: { pattern: /[0-9a-zA-Z]/, lowercase: true } },
          }"
        />
        <i
          class="fas fa-plus right-input-icon"
          v-if="index == this.MAIN.siteList.length - 1"
          @click="createNewSiteInput"
        ></i>
      </div>
    </div>
    <div
      class="input-group row no-gutters"
      v-for="(phone, index) in this.MAIN.phoneList"
      :key="phone"
    >
      <div class="col-4">
        <label class="input-label" v-if="!index">Общий телефон</label>
        <label class="input-label" v-else></label>
      </div>
      <div class="col-8 reproduce-input">
        <i
          class="fas fa-minus left-input-icon"
          v-if="index != 0"
          @click="deleteTelInput(index)"
        ></i>
        <input
          type="tel"
          v-model.lazy="this.MAIN.phoneList[index]"
          v-maska="[
            '+# (###) ###-##-##',
            '+## (###) ###-##-##',
            '+### (###) ###-##-##',
          ]"
        />
        <i
          class="fas fa-plus right-input-icon"
          v-if="index == this.MAIN.phoneList.length - 1"
          @click="createNewTelInput"
        ></i>
      </div>
    </div>
    <div
      class="input-group row no-gutters"
      v-for="(item, index) in this.MAIN.emailList"
      :key="item"
    >
      <div class="col-4">
        <label class="input-label" v-if="!index">Общий Email</label>
        <label class="input-label" v-else></label>
      </div>
      <div class="col-8 reproduce-input">
        <i
          class="fas fa-minus left-input-icon"
          v-if="index != 0"
          @click="deleteEmailInput(index)"
        ></i>
        <input type="email" v-model.lazy="this.MAIN.emailList[index]" />
        <i
          class="fas fa-plus right-input-icon"
          v-if="index == this.MAIN.emailList.length - 1"
          @click="createNewEmailInput"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MainInputList",
  props: {
    v: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["MAIN"]),
  },
  methods: {
    setDefaultName() {
      this.MAIN.nameEng = "";
      this.MAIN.nameRu = "";
    },
    createNewTelInput() {
      this.MAIN.phoneList.push("");
    },
    deleteTelInput(index) {
      this.MAIN.phoneList = this.MAIN.phoneList.filter(
        (item, idx) => idx != index
      );
    },
    createNewEmailInput() {
      this.MAIN.emailList.push("");
    },
    deleteEmailInput(index) {
      this.MAIN.emailList = this.MAIN.emailList.filter(
        (item, idx) => idx != index
      );
    },
    createNewSiteInput() {
      this.MAIN.siteList.push("");
    },
    deleteSiteInput(index) {
      this.MAIN.siteList = this.MAIN.siteList.filter(
        (item, idx) => idx != index
      );
    },
  },
};
</script>

<style>
</style>