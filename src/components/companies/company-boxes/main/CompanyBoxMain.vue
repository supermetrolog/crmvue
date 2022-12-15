<template>
  <CompanyBoxLayout :class="'grid-a'" class="CompanyBoxMain">
    <template #header>
      <div class="CompanyBoxMain-header">
        <div class="CompanyBoxMain-header-name">
          <span
            >{{ this.company.full_name }}
            <small
              @click="this.$emit('editCompany')"
              class="CompanyBoxMain-header-name-edit"
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
        <div class="CompanyBoxMain-left">
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
        <div class="CompanyBoxMain-right">
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
            <Tab name="Ревизиты"
              ><div><span>хуйвизиты</span></div></Tab
            >
          </Tabs>
        </div>
      </div>
      <hr />
      <div class="CompanyBoxMain-contacts">
        <CompanyBoxContactList
          :contacts="contacts"
          @openContactFormForUpdate="this.$emit('openContactFormForUpdate')"
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
  emits: ["openContactFormForUpdate", "editCompany"],
};
</script>