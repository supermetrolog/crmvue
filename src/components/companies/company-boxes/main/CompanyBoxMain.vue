<template>
  <CompanyBoxLayout :class="'grid-a'" class="CompanyBoxMain">
    <template #header>
      <div class="CompanyBoxMain-header">
        <div class="CompanyBoxMain-header-name">
          <span
            >{{ this.company.full_name }}
            <small class="edit_btn" @click="this.$emit('editCompany')"
              >[редактировать]</small
            ></span
          >
        </div>
        <div class="CompanyBoxMain-header-about">
          <span>{{ categoryHandler }} ID {{ company.id }}</span>
          <div class="CompanyBoxMain-header-about-rating">
            <i :class="rating(1)"></i>
            <i :class="rating(3)"></i>
            <i :class="rating(5)"></i>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="CompanyBoxMain-content">
        <div class="CompanyBoxMain-left" id="left-box">
          <ul class="CompanyBoxMain-left-list">
            <li class="CompanyBoxMain-left-list-websites">
              <span v-if="!!websitesHandler"
                ><a
                  :href="`http://${website}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="website"
                  v-for="website in websitesHandler"
                  :key="website"
                  >{{ website }}</a
                ></span
              >
              <span v-else>Нет данных</span>
              <span>Вебсайт</span>
            </li>
            <li>
              <span v-if="!!company.activityGroup">{{
                activityGroupOptions[company.activityGroup].label
              }}</span>
              <span v-else>Нет данных</span>
              <span>Группа деятельности</span>
            </li>
            <li>
              <span v-if="!!company.activityProfile">{{
                activityProfileOptions[company.activityProfile].label
              }}</span>
              <span v-else>Нет данных</span>
              <span>Профиль деятельности</span>
            </li>
            <li class="CompanyBoxMain-left-list-range">
              <span v-if="!!productRangesHandler">
                {{ productRangesHandler }}
              </span>
              <span v-else>Нет данных</span>
              <span>Номенклатура товара</span>
            </li>
            <li>
              <span v-if="!!company.consultant.userProfile.short_name">{{
                company.consultant.userProfile.short_name
              }}</span>
              <span v-else>Нет данных</span>
              <span>Внес</span>
            </li>
            <li>
              <span v-if="!!company.created_at">{{
                dateFormatter(company.created_at)
              }}</span>
              <span v-else>Нет данных</span>
              <span>Поступление</span>
            </li>
            <li>
              <span v-if="!!company.updated_at">{{
                dateFormatter(company.updated_at)
              }}</span>
              <span v-else>Нет данных</span>
              <span>Обновление</span>
            </li>
          </ul>
        </div>
        <div class="CompanyBoxMain-right" id="right-box">
          <Tabs :options="{ useUrlFragment: false }">
            <Tab name="Описание"
              ><div>
                <span v-if="company.description">{{
                  company.description
                }}</span>
                <span v-else>Не указано</span>
              </div></Tab
            >
            <Tab name="Адрес"
              ><div>
                <span v-if="!!company.officeAdress">{{
                  company.officeAdress
                }}</span>
                <span v-else>Не указан</span>
              </div></Tab
            >
            <Tab name="Ревизиты">
              <div>
                <ul class="CompanyBoxMain-requisites">
                  <li>
                    <span>Юр. адрес</span>
                    <span v-if="company.legalAddress">{{
                      company.legalAddress
                    }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>ОГРН</span>
                    <span v-if="company.ogrn">{{ company.ogrn }}</span>
                    <span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>ИНН</span>
                    <span v-if="company.inn">{{ company.inn }}</span>
                    <span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>КПП</span>
                    <span v-if="company.kpp">{{ company.kpp }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>Расчетный счет</span>
                    <span v-if="company.checkingAccount">{{
                      company.checkingAccount
                    }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>Кор. счет</span>
                    <span v-if="company.correspondentAccount">{{
                      company.correspondentAccount
                    }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>В банке</span>
                    <span v-if="company.inTheBank">{{ company.inTheBank }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>БИК</span>
                    <span v-if="company.bik">{{ company.bik }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>ОКПО</span>
                    <span v-if="company.okpo">{{ company.okpo }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>ОКВЭД</span>
                    <span v-if="company.okved">{{ company.okved }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>Имя подписанта</span>
                    <span v-if="company.signatoryName">{{
                      company.signatoryName
                    }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>Фамилия подписанта</span>
                    <span v-if="company.signatoryMiddleName">{{
                      company.signatoryMiddleName
                    }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>Отчество подписанта</span>
                    <span v-if="company.signatoryLastName">{{
                      company.signatoryLastName
                    }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>№ документа</span>
                    <span v-if="company.documentNumber">{{
                      company.documentNumber
                    }}</span
                    ><span v-else>нет данных</span>
                  </li>
                  <li>
                    <span>Действует на основе</span>
                    <span v-if="company.basis">{{ company.basis }}</span
                    ><span v-else>нет данных</span>
                  </li>
                </ul>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <hr />
      <div class="CompanyBoxMain-contacts">
        <CompanyBoxContactList
          @clickCreateContact="this.$emit('createContact')"
          :contacts="contacts"
        />
      </div>
    </template>
  </CompanyBoxLayout>
</template>

<script>
import CompanyBoxContactList from "./CompanyBoxContactList.vue";
import CompanyBoxLayout from "../CompanyBoxLayout.vue";
import { MixinCompanyDetailInfo } from "../../companies/mixins";
import { CompanyCategories } from "@/const/Const";
import moment from "moment";

export default {
  mixins: [MixinCompanyDetailInfo],
  name: "CompanyBoxMain",
  components: { CompanyBoxLayout, CompanyBoxContactList },
  inject: ["isMobile"],
  data() {
    return {
      leftBoxHeight: null,
    };
  },
  props: {
    company: {
      type: Object,
      default: () => {},
    },
    contacts: {
      type: Array,
    },
  },
  computed: {
    productRangesHandler() {
      let result;
      result = this.company.productRanges.map(function (range) {
        return range.product[0].toUpperCase() + range.product.slice(1);
      });
      result = result.join(", ");
      return result;
    },
    categoryHandler() {
      return this.company.categories
        .map((item) => CompanyCategories.get("param")[item.category][1])
        .join(" ")
        .toUpperCase();
    },
    websitesHandler() {
      let commonContact = this.company.contacts.find(
        (contact) => contact.type == 1
      );
      if (commonContact) {
        return commonContact.websites.map((item) => item.website);
      } else {
        return false;
      }
    },
  },
  methods: {
    dateFormatter(date) {
      return moment(date).format("DD.MM.YYYY");
    },
  },
  mounted() {
    if (this.isMobile) {
      return;
    } else {
      let divElement = document.querySelector("#left-box");
      let elemHeight = divElement.offsetHeight;
      this.leftBoxHeight = elemHeight;
      document.querySelector(
        "#right-box"
      ).style.height = `${this.leftBoxHeight}px`;
    }
  },
  emits: ["editCompany", "clickCreateContact"],
};
</script>