<template>
  <div class="requisistes-inputlist" v-if="form">
    <div class="input-group row no-gutters">
      <div class="col-7">
        <label class="input-label">Юр. адрес</label>
        <input type="text" v-model.trim="form.legalAddress" />
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-5 pr-2">
        <label class="input-label">ОГРН</label
        ><input
          :class="{
            invalid: v.ogrn.$error,
            valid: v.ogrn.$dirty && !v.ogrn.$error && form.ogrn,
          }"
          type="text"
          @input="v.ogrn.$touch"
          v-model.trim="form.ogrn"
          v-maska="'#############'"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.ogrn.$error"
        >
          <span>{{ v.ogrn.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-4 pr-2">
        <label class="input-label">ИНН</label>
        <input
          :class="{
            invalid: v.inn.$error,
            valid: v.inn.$dirty && !v.inn.$error && form.inn,
          }"
          type="text"
          @input="v.inn.$touch"
          v-model.trim="form.inn"
          v-maska="'############'"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.inn.$error"
        >
          <span>{{ v.inn.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-3">
        <label class="input-label">КПП</label>
        <input
          :class="{
            invalid: v.kpp.$error,
            valid: v.kpp.$dirty && !v.kpp.$error && form.kpp,
          }"
          type="text"
          @input="v.kpp.$touch"
          v-model.trim="form.kpp"
          v-maska="'#########'"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.kpp.$error"
        >
          <span>{{ v.kpp.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4 pr-2">
        <label class="input-label">Расчетный счет</label
        ><input
          :class="{
            invalid: v.checkingAccount.$error,
            valid:
              v.checkingAccount.$dirty &&
              !v.checkingAccount.$error &&
              form.checkingAccount,
          }"
          type="text"
          @input="v.checkingAccount.$touch"
          v-model.trim="form.checkingAccount"
          v-maska="'####################'"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.checkingAccount.$error"
        >
          <span>{{ v.checkingAccount.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-4 pr-2">
        <label class="input-label">Корреспондентский счет</label>
        <input
          :class="{
            invalid: v.correspondentAccount.$error,
            valid:
              v.correspondentAccount.$dirty &&
              !v.correspondentAccount.$error &&
              form.correspondentAccount,
          }"
          type="text"
          @input="v.correspondentAccount.$touch"
          v-model.trim="form.correspondentAccount"
          v-maska="'####################'"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.correspondentAccount.$error"
        >
          <span>{{ v.correspondentAccount.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-4">
        <label class="input-label">В банке</label>
        <input type="text" v-model.trim="form.inTheBank" />
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-3 pr-2">
        <label class="input-label">БИК</label
        ><input
          :class="{
            invalid: v.bik.$error,
            valid: v.bik.$dirty && !v.bik.$error && form.bik,
          }"
          type="text"
          @input="v.bik.$touch"
          v-model.trim="form.bik"
          v-maska="'#########'"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.bik.$error"
        >
          <span>{{ v.bik.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-3 pr-2">
        <label class="input-label">ОКПО</label>
        <input
          :class="{
            invalid: v.okpo.$error,
            valid: v.okpo.$dirty && !v.okpo.$error && form.okpo,
          }"
          type="text"
          @input="v.okpo.$touch"
          v-model.trim="form.okpo"
          v-maska="'##########'"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.okpo.$error"
        >
          <span>{{ v.okpo.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-6">
        <label class="input-label">ОКВЭД</label>
        <input
          :class="{
            invalid: v.okved.$error,
            valid: v.okved.$dirty && !v.okved.$error && form.okved,
          }"
          type="text"
          @input="v.okved.$touch"
          v-model.trim="form.okved"
          v-maska="'##############################'"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.okved.$error"
        >
          <span>{{ v.okved.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4 pr-2">
        <label class="input-label">Имя подписанта</label>
        <input type="text" v-model.trim="form.signatodyName" />
      </div>
      <div class="col-4 pr-2">
        <label class="input-label">Фамилия подписанта</label>
        <input type="text" v-model.trim="form.signatodyMiddleName" />
      </div>
      <div class="col-4 pr-2">
        <label class="input-label">Отчество подписанта</label>
        <input type="text" v-model.trim="form.signatodyLastName" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainInputList",
  data() {
    return {
      form: null,
    };
  },
  props: {
    v: {
      type: Object,
    },
    formdata: {
      type: Object,
    },
  },
  methods: {
    test() {
      console.log(this.form.nameEng);
    },
  },
  mounted() {
    this.form = this.formdata;
  },
  watch: {
    formdata() {
      this.form = this.formdata;
    },
  },
};
</script>

<style>
</style>