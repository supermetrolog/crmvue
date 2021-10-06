<template>
  <div class="main-input-list">
    <div class="input-group row no-gutters">
      <!-- <div class="col-1">
        <label class="input-label" title="Нет названия">Нет</label>
        <input
          class="checkbox large"
          type="checkbox"
          @change="setDefaultName"
          v-model="form.noName"
          title="Нет названия"
        />
      </div> -->
      <div class="col-1">
        <label class="input-label" title="Нет названия"> Нет </label>
        <input
          class="checkbox large"
          @click="form.noName ? (form.noName = null) : ''"
          v-model="form.noName"
          type="radio"
          value="1"
          title="Нет названия"
        />
      </div>
      <div class="col-6 pr-2" v-if="!form.noName">
        <label class="input-label required">Название Eng</label>
        <input
          :class="{
            invalid: v.nameEng.$error,
            valid: v.nameEng.$dirty && !v.nameEng.$error,
          }"
          type="text"
          @input="v.nameEng.$touch"
          v-model.trim="form.nameEng"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.nameEng.$error"
        >
          <span>{{ v.nameEng.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-5" v-if="!form.noName">
        <label class="input-label required">Название Ru</label>
        <input
          :class="{
            invalid: v.nameRu.$error,
            valid: v.nameRu.$dirty && !v.nameRu.$error,
          }"
          @input="v.nameRu.$touch"
          type="text"
          v-model.trim="form.nameRu"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.nameRu.$error"
        >
          <span>{{ v.nameRu.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-3">
        <label class="input-label">Форма органиизации</label>
        <select v-model="form.formOfOrganization">
          <option value="1">OOO</option>
          <option value="2">OAO</option>
        </select>
      </div>
      <div class="col-5 pl-2 pr-2">
        <label class="input-label">Входит в ГК</label>
        <Multiselect
          v-model="form.companyGroup_id"
          :options="COMPANY_GROUP_LIST"
          :canDeselect="false"
        />
      </div>
      <div class="col-4">
        <label class="input-label">Адрес офиса</label>
        <input type="text" v-model.trim="form.officeAdress" />
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-7 pr-2">
        <label class="input-label required">Категория</label>
        <div
          class="checkbox-group pb-2"
          :class="{
            invalid: v.categories.$error,
          }"
        >
          <div
            class="d-inline-block mr-1"
            v-for="category of categoryList"
            :key="category[0]"
          >
            <input
              class="checkbox ml-0"
              type="checkbox"
              v-model="form.categories"
              :value="category[0]"
              :id="'checkbox' + category[0]"
            />
            <label class="checkbox-label" :for="'checkbox' + category[0]">{{
              category[1]
            }}</label>
          </div>
        </div>
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.categories.$error"
        >
          <span>{{ v.categories.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-2 pr-2">
        <label class="input-label required">Статус</label>
        <div
          class="checkbox-group pb-2"
          :class="{
            invalid: v.status.$error,
          }"
        >
          <input
            class="checkbox ml-0"
            type="radio"
            v-model="form.status"
            value="1"
            id="radio-0"
          />
          <label class="checkbox-label" for="radio-0">актив</label> <br />
          <input
            class="checkbox ml-0"
            type="radio"
            v-model="form.status"
            value="0"
            id="radio-1"
          />
          <label class="checkbox-label" for="radio-1">пассив</label>
        </div>
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.status.$error"
        >
          <span>{{ v.status.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-3">
        <label class="input-label required">Консультант</label>
        <Multiselect
          v-model="form.consultant_id"
          :options="CONSULTANT_LIST"
          :canDeselect="false"
          :canClear="false"
          @input="v.consultant_id.$touch"
          :class="{
            invalid: v.consultant_id.$error,
            valid: v.consultant_id.$dirty && !v.consultant_id.$error,
          }"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.consultant_id.$error"
        >
          <span>{{ v.consultant_id.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Вебсайт</label>
        <div
          class="reproduce-input"
          v-for="(item, index) in form.contacts.websites"
          :key="item"
        >
          <i
            class="fas fa-minus left-input-icon"
            v-if="index != 0"
            @click="deleteWebsiteInput(index)"
          ></i>
          <input type="text" v-model.lazy="form.contacts.websites[index]" />
          <i
            class="fas fa-plus right-input-icon"
            v-if="index == form.contacts.websites.length - 1"
            @click="createNewWebsiteInput"
          ></i>
        </div>
      </div>
      <div class="col-4 pl-2 pr-2">
        <label class="input-label">Общий телефон</label>
        <div
          class="reproduce-input"
          v-for="(phone, index) in form.contacts.phones"
          :key="index"
        >
          <i
            class="fas fa-minus left-input-icon"
            v-if="index != 0"
            @click="deleteTelInput(index)"
          ></i>
          <input
            type="tel"
            v-model.lazy="form.contacts.phones[index]"
            v-maska="[
              '+# (###) ###-##-##',
              '+## (###) ###-##-##',
              '+### (###) ###-##-##',
            ]"
          />
          <i
            class="fas fa-plus right-input-icon"
            v-if="index == form.contacts.phones.length - 1"
            @click="createNewTelInput"
          ></i>
        </div>
      </div>
      <div class="col-4">
        <label class="input-label">Общий Email</label>
        <div
          class="reproduce-input"
          v-for="(item, index) in form.contacts.emails"
          :key="index"
        >
          <i
            class="fas fa-minus left-input-icon"
            v-if="index != 0"
            @click="deleteEmailInput(index)"
          ></i>
          <input type="email" v-model.lazy="form.contacts.emails[index]" />
          <i
            class="fas fa-plus right-input-icon"
            v-if="index == form.contacts.emails.length - 1"
            @click="createNewEmailInput"
          ></i>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4 pr-2">
        <label class="input-label required">Группа деятельности</label>
        <select
          :class="{
            invalid: v.activityGroup.$error,
            valid:
              v.activityGroup.$dirty &&
              !v.activityGroup.$error &&
              form.activityGroup,
          }"
          @change="v.activityGroup.$touch"
          v-model="form.activityGroup"
        >
          <option value="0">FUCK</option>
        </select>
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.activityGroup.$error"
        >
          <span>{{ v.activityGroup.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-4 pr-2">
        <label class="input-label required">Профиль деятельности</label>
        <select
          :class="{
            invalid: v.activityProfile.$error,
            valid:
              v.activityProfile.$dirty &&
              !v.activityProfile.$error &&
              form.activityProfile,
          }"
          @change="v.activityProfile.$touch"
          v-model="form.activityProfile"
        >
          <option value="0">SUYCK</option>
        </select>
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.activityProfile.$error"
        >
          <span>{{ v.activityProfile.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-4">
        <label class="input-label required">Номенклатура товара</label>
        <TagsInput
          :invalid="v.productRanges.$error"
          @addTag="clickAddTag"
          @deleteTag="clickDeleteTag"
          :tags="form.productRanges"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.productRanges.$error"
        >
          <span>{{ v.productRanges.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-6 pr-2">
        <label class="input-label">Описание</label>
        <textarea type="text" v-model="form.description" />
      </div>
      <div class="col-6">
        <label class="input-label" @click="testw">Документы</label>
        <!-- <input type="file" class="d-none" />
        <button @click.prevent class="btn btn-primary btn-large">
          Открыть
        </button> -->
        <FileInput v-model="form.files" is-pdf />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TagsInput from "@/components/TagsInput";
import FileInput from "@/components/FileInput";
import { CompanyCategories } from "@/const/Const.js";
import Multiselect from "@vueform/multiselect";

export default {
  name: "MainInputList",
  components: {
    TagsInput,
    FileInput,
    Multiselect,
  },
  data() {
    return {
      categoryList: CompanyCategories.get("param"),
      form: {
        contacts: {
          websites: [""],
          phones: [""],
          emails: [""],
        },
      },
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
  computed: {
    ...mapGetters(["CONSULTANT_LIST", "COMPANY_GROUP_LIST"]),
  },
  methods: {
    test() {
      this.v.nameEng.$touch;
      console.log(this.v.nameEng.$error, this.form.nameEng);
    },
    testw() {
      console.log(this.form.contacts.websites[0]);
    },
    clickAddTag(newTag) {
      this.$emit("addProductRangeItem", newTag);
    },
    clickDeleteTag(index) {
      this.$emit("deleteProductRangeItem", index);
    },
    setDefaultName() {
      this.form.nameEng = "";
      this.form.nameRu = "";
    },
    createNewTelInput() {
      this.form.contacts.phones.push("");
    },
    deleteTelInput(index) {
      this.form.contacts.phones = this.form.contacts.phones.filter(
        (item, idx) => idx != index
      );
    },
    createNewEmailInput() {
      this.form.contacts.emails.push("");
    },
    deleteEmailInput(index) {
      this.form.contacts.emails = this.form.contacts.emails.filter(
        (item, idx) => idx != index
      );
    },
    createNewWebsiteInput() {
      this.form.contacts.websites.push("");
    },
    deleteWebsiteInput(index) {
      this.form.contacts.websites = this.form.contacts.websites.filter(
        (item, idx) => idx != index
      );
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