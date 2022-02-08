<template>
  <div class="company-table-view">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th>название компании</Th>
          <Th>статус компании</Th>
          <Th>контакт</Th>
          <Th>консультант</Th>
          <Th>актив. запросы</Th>
          <Th>кол-во сделок</Th>
          <Th>рейтинг</Th>
          <Th>Дата</Th>
        </Tr>
      </template>
      <template #tbody>
        <Tr v-for="(company, index) in companies" :key="company.id">
          <Td class="px-2 text-center"> {{ index + 1 }} </Td>
          <Td class="name">
            <router-link :to="'/companies/' + company.id" target="_blank">
              <h4>
                {{ company.full_name }}
              </h4>

              <p v-if="!company.nameRu" class="text-danger">&#8212;</p>
              <Progress :percent="company.progress_percent" />
            </router-link>
          </Td>
          <Td class="text-center categories">
            <div class="d-inline-block" v-if="company.categories.length">
              <span
                v-for="categoryItem of company.categories"
                :key="categoryItem.id"
                class="badge badge-dark autosize py-2 m-2 d-inline-block"
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
          <Td class="text-center requests">
            <div class="scroller">
              <div
                v-for="request in company.requests"
                :key="request.id"
                class="mb-2 align-self-center align-items-center"
              >
                <span class="badge badge-blue-green autosize">
                  {{ request.name }}
                </span>
              </div>
            </div>
          </Td>
          <Td class="text-center">
            <span class="badge badge-blue-green autosize">
              {{ company.deal_count }}
            </span>
          </Td>
          <Td class="text-center">
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
          <Td class="text-center date">
            {{ company.created_at_format }}
          </Td>
        </Tr>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from "@/components/table/Table";
import Tr from "@/components/table/Tr";
import Th from "@/components/table/Th";
import Td from "@/components/table/Td";
import Progress from "@/components/Progress";
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