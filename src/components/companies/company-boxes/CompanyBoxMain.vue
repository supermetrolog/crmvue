<template>
  <CompanyBoxLayout :class="'grid-a'" class="CompanyBoxMain">
    <template #header>
      <span>{{ this.company.full_name }}</span>
    </template>
    <template #content>
      <div class="CompanyBoxMain-content">
        <div class="CompanyBoxMain-left">
          <ul class="CompanyBoxMain-left-list">
            <li>
              <span v-if="!!company.website"
                ><a
                  :href="`http://${company.website}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ company.website }}</a
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
                <span>{{ company.description }}</span>
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
      <span>12323</span>
    </template>
  </CompanyBoxLayout>
</template>

<script>
import CompanyBoxLayout from "./CompanyBoxLayout.vue";
import { MixinCompanyDetailInfo } from "../companies/mixins";
import moment from "moment";
export default {
  mixins: [MixinCompanyDetailInfo],
  name: "CompanyBoxMain",
  components: { CompanyBoxLayout },
  props: {
    company: {
      type: Object,
      default: () => {},
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
  },
  methods: {
    dateFormatter(date) {
      return moment(date).format("DD.MM.YYYY");
    },
  },
};
</script>