<template>
  <div class="requisistes-inputlist">
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Юр. адрес</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input type="text" v-model.trim="this.REQUISISTES.legalAddress" />
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">ОГРН</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              :class="{
                invalid: v.ogrn.$error,
                valid: v.ogrn.$dirty && !v.ogrn.$error && this.REQUISISTES.ogrn,
              }"
              type="text"
              @input="v.ogrn.$touch"
              v-model.trim="this.REQUISISTES.ogrn"
              v-maska="'#############'"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.ogrn.$error"
          >
            <span>{{ v.ogrn.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">ИНН</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              :class="{
                invalid: v.inn.$error,
                valid: v.inn.$dirty && !v.inn.$error && this.REQUISISTES.inn,
              }"
              type="text"
              @input="v.inn.$touch"
              v-model.trim="this.REQUISISTES.inn"
              v-maska="'############'"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.inn.$error"
          >
            <span>{{ v.inn.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">КПП</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              :class="{
                invalid: v.kpp.$error,
                valid: v.kpp.$dirty && !v.kpp.$error && this.REQUISISTES.kpp,
              }"
              type="text"
              @input="v.kpp.$touch"
              v-model.trim="this.REQUISISTES.kpp"
              v-maska="'#########'"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.kpp.$error"
          >
            <span>{{ v.kpp.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Расчетный счет</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              :class="{
                invalid: v.checkingAccount.$error,
                valid:
                  v.checkingAccount.$dirty &&
                  !v.checkingAccount.$error &&
                  this.REQUISISTES.checkingAccount,
              }"
              type="text"
              @input="v.checkingAccount.$touch"
              v-model.trim="this.REQUISISTES.checkingAccount"
              v-maska="'####################'"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.checkingAccount.$error"
          >
            <span>{{ v.checkingAccount.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Корреспондентский счет</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              :class="{
                invalid: v.correspondentAccount.$error,
                valid:
                  v.correspondentAccount.$dirty &&
                  !v.correspondentAccount.$error &&
                  this.REQUISISTES.correspondentAccount,
              }"
              type="text"
              @input="v.correspondentAccount.$touch"
              v-model.trim="this.REQUISISTES.correspondentAccount"
              v-maska="'####################'"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.correspondentAccount.$error"
          >
            <span>{{ v.correspondentAccount.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">В банке</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input type="text" v-model.trim="this.REQUISISTES.inTheBank" />
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">БИК</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              :class="{
                invalid: v.bik.$error,
                valid: v.bik.$dirty && !v.bik.$error && this.REQUISISTES.bik,
              }"
              type="text"
              @input="v.bik.$touch"
              v-model.trim="this.REQUISISTES.bik"
              v-maska="'#########'"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.bik.$error"
          >
            <span>{{ v.bik.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">ОКВЭД</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              :class="{
                invalid: v.okved.$error,
                valid:
                  v.okved.$dirty && !v.okved.$error && this.REQUISISTES.okved,
              }"
              type="text"
              @input="v.okved.$touch"
              v-model.trim="this.REQUISISTES.okved"
              v-maska="'##############################'"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.okved.$error"
          >
            <span>{{ v.okved.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">ОКПО</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              :class="{
                invalid: v.okpo.$error,
                valid: v.okpo.$dirty && !v.okpo.$error && this.REQUISISTES.okpo,
              }"
              type="text"
              @input="v.okpo.$touch"
              v-model.trim="this.REQUISISTES.okpo"
              v-maska="'##########'"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.okpo.$error"
          >
            <span>{{ v.okpo.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Имя подписанта</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input type="text" v-model.trim="this.REQUISISTES.signatodyName" />
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Фамилия подписанта</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              type="text"
              v-model.trim="this.REQUISISTES.signatodyMiddleName"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Отчество подписанта</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <input
              type="text"
              v-model.trim="this.REQUISISTES.signatodyLastName"
            />
          </div>
        </div>
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
    ...mapGetters(["REQUISISTES"]),
  },
  methods: {
    test() {
      console.log(this.REQUISISTES.nameEng);
    },
  },
};
</script>

<style>
</style>