<template>
  <div class="company-table-view">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th sort="nameRu">название компании</Th>
          <Th sort="rating">рейтинг</Th>
          <Th>актив. запросы</Th>
          <Th>категория</Th>
          <Th>контакт</Th>
          <Th>консультант</Th>
          <Th sort="created_at">Дата</Th>
          <Th sort="status">статус</Th>
        </Tr>
      </template>
      <template #tbody>
        <Loader v-if="loader" class="center" />
        <Tr v-for="company in companies" :key="company.id">
          <Td class="text-center p-0"> {{ company.id }} </Td>
          <Td class="name" sort="nameRu">
            <router-link :to="'/companies/' + company.id" target="_blank">
              <h4 class="d-inline" :class="{ 'text-warning': !company.status }">
                {{ company.full_name }}
              </h4>
              <Progress :percent="company.progress_percent" />
            </router-link>
          </Td>
          <Td class="text-center" sort="rating">
            <i
              v-for="rating in ratingOptions"
              :key="rating[0]"
              class="text-warning far fa-star"
              :class="{
                'fas fa-star': company.rating >= rating[0],
              }"
            >
            </i>
          </Td>
          <Td class="text-center requests">
            <div class="scroller">
              <div>
                <span
                  class="badge badge-blue-green autosize d-block"
                  v-for="request in company.requests"
                  :key="request.id"
                >
                  {{ request.name }}
                </span>
              </div>
            </div>
          </Td>
          <Td class="text-center categories">
            <div class="d-inline-block" v-if="company.categories.length">
              <span
                v-for="categoryItem of company.categories"
                :key="categoryItem.id"
                class="badge autosize p-0 mx-1 d-inline-block"
              >
                {{ category(categoryItem.category) }}
              </span>
            </div>
            <p v-else>&#8212;</p>
          </Td>
          <Td class="text-center contacts">
            <template v-if="contacts(company.id)">
              <p
                v-if="
                  !contacts(company.id).contact.phones.length &&
                  !contacts(company.id).contact.emails.length
                "
              >
                &#8212;
              </p>
              <div v-for="contact in contacts(company.id)" :key="contact.id">
                <a
                  :href="'mailto:' + email.email"
                  v-for="email of contact.emails"
                  :key="email.email"
                  class="d-block"
                >
                  {{ email.email }}
                </a>
                <PhoneNumber
                  v-for="phone of contact.phones"
                  :key="phone.id"
                  :phone="phone"
                  :contact="contact"
                />
              </div>
            </template>
            <p v-else>&#8212;</p>
          </Td>
          <Td class="text-center">
            {{ company.consultant.userProfile.short_name }}
          </Td>
          <Td class="text-center date" sort="created_at">
            {{ company.created_at_format }}
          </Td>
          <Td class="text-center" sort="status">
            <h4 class="text-success" v-if="company.status">Актив</h4>
            <span class="badge badge-warning autosize" v-else> Пассив </span>
          </Td>
        </Tr>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from "@/components/common/table/Table";
import Tr from "@/components/common/table/Tr";
import Th from "@/components/common/table/Th";
import Td from "@/components/common/table/Td";
import Progress from "@/components/common/Progress";
import { CompanyCategories, RatingList } from "@/const/Const";
export default {
  name: "CompanyTableView",
  components: {
    Table,
    Tr,
    Th,
    Td,
    Progress,
  },
  data() {
    return {
      generalContacts: [],
      ratingOptions: RatingList.get("param"),
    };
  },
  props: {
    companies: {
      type: Array,
    },
    loader: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    category(categoryValue) {
      return CompanyCategories.get("param")[categoryValue][1];
    },
    contacts(company_id) {
      let result = this.generalContacts.find(
        (item) => item.company_id == company_id
      );
      return result;
    },
    normalizeContacts() {
      this.companies.map((company) => {
        company.contacts.map((contact) => {
          if (contact.type == 1) {
            this.generalContacts.push({
              company_id: company.id,
              contact: contact,
            });
          }
        });
      });
    },
  },
  mounted() {
    this.normalizeContacts();
  },
  watch: {
    companies() {
      this.normalizeContacts();
    },
  },
};
</script>

<style>
</style>