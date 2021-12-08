<template>
  <div class="company-table-view">
    <table>
      <thead>
        <tr>
          <th>#id</th>
          <th class="text-left">название компании</th>
          <th>статус компании</th>
          <th>контакты</th>
          <th>брокер</th>
          <th>запросов</th>
          <th>сделок</th>
          <th>предложений</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="company in companies" :key="company.id">
          <td>{{ company.id }}</td>
          <td class="text-left name">
            <router-link :to="'/companies/' + company.id" target="_blank">
              <h4>
                {{ company.nameRu }} {{ company.nameRu ? " &#8212; " : "" }}
                {{ company.nameEng }}
              </h4>

              <p v-if="!company.nameRu" class="text-danger">&#8212;</p>
              <Progress :percent="company.progress_percent" />
            </router-link>
          </td>

          <td class="categories">
            <div class="d-inline-block" v-if="company.categories.length">
              <span
                v-for="categoryItem of company.categories"
                :key="categoryItem.id"
                class="p-2 m-1 d-inline-block"
              >
                {{ category(categoryItem.category) }}
              </span>
            </div>

            <p v-else>&#8212;</p>
          </td>
          <td class="contacts">
            <p v-if="!contacts(company.id)">&#8212;</p>

            <div v-for="contact in contacts(company.id)" :key="contact.id">
              <a
                :href="'mailto:' + email.email"
                v-for="email of contact.emails"
                :key="email.email"
              >
                {{ email.email }}
              </a>
              <PhoneNumber
                v-for="phone of contact.phones"
                :key="phone.id"
                :phone="phone.phone"
                :contact="contact"
              />
              <!-- <a
                :href="'tel:' + phone.phone"
                v-for="phone of contact.phones"
                :key="phone.phone"
              >
                {{ phone.phone }}
              </a> -->
            </div>
          </td>
          <td>Андреев В. И.</td>
          <td class="count">
            <span class="p-2">{{ company.request_count }}</span>
          </td>
          <td class="count">
            <span class="p-2">{{ company.object_count }}</span>
          </td>
          <td class="count">
            <span class="p-2">{{ company.offer_count }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Progress from "@/components/Progress";
import { CompanyCategories } from "@/const/Const";

export default {
  name: "CompanyTableView",
  components: {
    Progress,
  },
  data() {
    return {
      generalContacts: [],
    };
  },
  props: {
    companies: {
      type: Array,
    },
  },
  computed: {},
  methods: {
    category(categoryValue) {
      return CompanyCategories.get("param")[categoryValue][1];
    },
    contacts(company_id) {
      return this.generalContacts.find((item) => item.company_id == company_id);
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
  mounted() {},
  watch: {
    companies() {
      this.normalizeContacts();
    },
  },
};
</script>

<style>
</style>