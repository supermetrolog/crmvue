<template>
  <div class="main-input-list">
    <div class="input-group row no-gutters">
      <div class="col-1">
        <label class="input-label" title="Нет названия">Нет</label>
        <input
          class="checkbox large"
          type="checkbox"
          @change="setDefaultName"
          v-model="this.FORM.noName"
          title="Нет названия"
        />
      </div>
      <div class="col-6 pr-2" v-if="!this.FORM.noName">
        <label class="input-label required">Название Eng</label>
        <input
          :class="{
            invalid: v.nameEng.$error,
            valid: v.nameEng.$dirty && !v.nameEng.$error,
          }"
          type="text"
          @input="v.nameEng.$touch"
          v-model.trim="this.FORM.nameEng"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.nameEng.$error"
        >
          <span>{{ v.nameEng.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="col-5" v-if="!this.FORM.noName">
        <label class="input-label required">Название Ru</label>
        <input
          :class="{
            invalid: v.nameRu.$error,
            valid: v.nameRu.$dirty && !v.nameRu.$error,
          }"
          @input="v.nameRu.$touch"
          type="text"
          v-model.trim="this.FORM.nameRu"
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
        <select v-model="this.FORM.formOfOrganization">
          <option value="1">OOO</option>
          <option value="2">OAO</option>
        </select>
      </div>
      <div class="col-5 pl-2 pr-2">
        <label class="input-label">Входит в ГК</label>
        <input type="text" v-model.trim="this.FORM.companyGroup" />
      </div>
      <div class="col-4">
        <label class="input-label">Адрес офиса</label>
        <input type="text" v-model.trim="this.FORM.officeAdress" />
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-7 pr-2">
        <label class="input-label required">Категория</label>
        <div
          class="checkbox-group pb-2"
          :class="{
            invalid: v.category.$error,
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
              v-model="this.FORM.category"
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
          v-if="v.category.$error"
        >
          <span>{{ v.category.$errors[0].$message }}</span>
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
            v-model="this.FORM.status"
            @click="test"
            value="1"
            id="radio-0"
          />
          <label class="checkbox-label" for="radio-0">актив</label> <br />
          <input
            class="checkbox ml-0"
            type="radio"
            v-model="this.FORM.status"
            @click="test"
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
        <select
          :class="{
            invalid: v.consultant.$error,
            valid: v.consultant.$dirty && !v.consultant.$error,
          }"
          @input="v.consultant.$touch"
          v-model="this.FORM.consultant"
          @change="test"
        >
          <option value="532">АлександрАлександрАлександр</option>
          <option value="312">Сергей</option>
          <option value="12">Павел</option>
          <option value="444">Татьяна</option>
          <option value="333">Мария</option>
          <option value="222">Павел</option>
        </select>
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.consultant.$error"
        >
          <span>{{ v.consultant.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Вебсайт</label>
        <div
          class="reproduce-input"
          v-for="(site, index) of this.FORM.siteList"
          :key="index"
        >
          <i
            class="fas fa-minus left-input-icon"
            v-if="index != 0"
            @click="deleteSiteInput(index)"
          ></i>
          <input type="text" v-model.lazy="this.FORM.siteList[index]" />
          <i
            class="fas fa-plus right-input-icon"
            v-if="index == this.FORM.siteList.length - 1"
            @click="createNewSiteInput"
          ></i>
        </div>
      </div>
      <div class="col-4 pl-2 pr-2">
        <label class="input-label">Общий телефон</label>

        <div
          class="reproduce-input"
          v-for="(phone, index) in this.FORM.phoneList"
          :key="phone"
        >
          <i
            class="fas fa-minus left-input-icon"
            v-if="index != 0"
            @click="deleteTelInput(index)"
          ></i>
          <input
            type="tel"
            v-model.lazy="this.FORM.phoneList[index]"
            v-maska="[
              '+# (###) ###-##-##',
              '+## (###) ###-##-##',
              '+### (###) ###-##-##',
            ]"
          />
          <i
            class="fas fa-plus right-input-icon"
            v-if="index == this.FORM.phoneList.length - 1"
            @click="createNewTelInput"
          ></i>
        </div>
      </div>
      <div class="col-4">
        <label class="input-label">Общий Email</label>

        <div
          class="reproduce-input"
          v-for="(item, index) in this.FORM.emailList"
          :key="item"
        >
          <i
            class="fas fa-minus left-input-icon"
            v-if="index != 0"
            @click="deleteEmailInput(index)"
          ></i>
          <input type="email" v-model.lazy="this.FORM.emailList[index]" />
          <i
            class="fas fa-plus right-input-icon"
            v-if="index == this.FORM.emailList.length - 1"
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
              this.FORM.activityGroup,
          }"
          @change="v.activityGroup.$touch"
          v-model="this.FORM.activityGroup"
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
              this.FORM.activityProfile,
          }"
          @change="v.activityProfile.$touch"
          v-model="this.FORM.activityProfile"
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
          :invalid="v.productRange.$error"
          @addTag="clickAddTag"
          @deleteTag="clickDeleteTag"
          :tags="this.FORM.productRange"
        />
        <div
          class="col-12 text-center error-container pt-1 pb-0"
          v-if="v.productRange.$error"
        >
          <span>{{ v.productRange.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-6 pr-2">
        <label class="input-label">Описание</label>
        <textarea type="text" v-model="this.FORM.description" />
      </div>
      <div class="col-6">
        <label class="input-label">Документы</label>
        <!-- <input type="file" class="d-none" />
        <button @click.prevent class="btn btn-primary btn-large">
          Открыть
        </button> -->
        <FileInput v-model="this.FORM.files" is-pdf />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TagsInput from "@/components/TagsInput";
import FileInput from "@/components/FileInput";
import { CompanyCategories } from "@/const/Const.js";
export default {
  name: "MainInputList",
  components: {
    TagsInput,
    FileInput,
  },
  data() {
    return {
      categoryList: CompanyCategories.get("param"),
    };
  },
  props: {
    v: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["FORM"]),
  },
  methods: {
    ...mapActions(["ADD_PRODUCT_RANGE_ITEM", "DELETE_PRODUCT_RANGE_ITEM"]),
    test() {
      this.v.nameEng.$touch;
      console.log(this.v.nameEng.$error, this.FORM.nameEng);
    },
    clickAddTag(newTag) {
      this.ADD_PRODUCT_RANGE_ITEM(newTag);
    },
    clickDeleteTag(index) {
      this.DELETE_PRODUCT_RANGE_ITEM(index);
    },
    setDefaultName() {
      this.FORM.nameEng = "";
      this.FORM.nameRu = "";
    },
    createNewTelInput() {
      this.FORM.phoneList.push("");
    },
    deleteTelInput(index) {
      this.FORM.phoneList = this.FORM.phoneList.filter(
        (item, idx) => idx != index
      );
    },
    createNewEmailInput() {
      this.FORM.emailList.push("");
    },
    deleteEmailInput(index) {
      this.FORM.emailList = this.FORM.emailList.filter(
        (item, idx) => idx != index
      );
    },
    createNewSiteInput() {
      this.FORM.siteList.push("");
    },
    deleteSiteInput(index) {
      this.FORM.siteList = this.FORM.siteList.filter(
        (item, idx) => idx != index
      );
    },
  },
};
</script>

<style>
</style>