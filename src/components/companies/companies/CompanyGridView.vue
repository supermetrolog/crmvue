<template>
  <div class="objects-grid">
    <div class="row no-gutters">
      <div
        v-for="company of companies"
        :key="company.id"
        class="col-lg-4 col-md-6 col-12 object-grid-item pr-4 mb-4"
        :class="{ inactive: company.active == 0 }"
      >
        <div class="row no-gutters card">
          <router-link
            custom
            v-slot="{ navigate }"
            :to="'/companies/' + company.id"
            target="_blank"
          >
            <div
              class="col-lg-4 col-12 d-flex card-left pr-4 pl-4 pt-3 pb-3"
              @click="navigate"
            >
              <div class="row">
                <div class="col-12 id">
                  <p>ID:</p>
                  <span>{{ company.id }}</span>
                </div>
                <div class="col-12 title text-center mt-1 mb-1">
                  <h3>{{ company.nameRu }} - {{ company.nameEng }}</h3>
                </div>
                <div class="col-12 pt-1 footer align-self-end">
                  <p>{{ company.created_at }}</p>
                </div>
              </div>
            </div>
          </router-link>
          <div class="col-lg-8 col-12 card-right pr-4 pl-4 pt-3 pb-3 d-flex">
            <div class="row no-gutters">
              <div class="col-12">
                <div class="row no-gutters header">
                  <div class="col-lg-7 col-5 category">
                    <p
                      v-for="categoryItem of company.categories"
                      :key="categoryItem.id"
                      class="mr-1"
                    >
                      {{ category(categoryItem.category) }}
                    </p>
                  </div>
                  <div class="col-lg-5 col-7 text-right pt-1">
                    <Progress :percent="company.progress_percent" />
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="row no-gutters contact-list mt-1 mb-1">
                  <p
                    class="text-center not-contacts"
                    v-if="!company.contacts[0]"
                  >
                    нет контактов
                  </p>
                  <div
                    class="col-12 contact-list-item"
                    :class="{ inactive: contact.status == 0 }"
                    :title="
                      contact.first_name +
                      ' ' +
                      contact.middle_name +
                      ' ' +
                      contact.last_name +
                      '\n' +
                      contact.comment
                    "
                    v-for="contact of company.contacts"
                    :key="contact.phone"
                  >
                    <div class="row no-gutters">
                      <div class="col-12">
                        <div class="row">
                          <div class="col-12 text-center name">
                            <p>
                              {{
                                contact.first_name + " " + contact.middle_name
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="col-6 contact-data text-center text-lg-left">
                        <a
                          :href="'mailto:' + email.email"
                          v-for="email of contact.emails"
                          :key="email.email"
                        >
                          {{ email.email }}
                        </a>
                      </div>
                      <div
                        class="col-6 contact-data text-center text-lg-right pr-1"
                      >
                        <a
                          :href="'tel:' + phone.phone"
                          v-for="phone of contact.phones"
                          :key="phone.phone"
                        >
                          {{ phone.phone }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 align-self-end mt-2">
                <div class="row no-gutters footer">
                  <div class="col-12 text-lg-left text-right">
                    <p class="mr-2">ЗАПРОСЫ: {{ company.request_count }}</p>
                    <p class="mr-2">ПРЕДЛОЖЕНИЯ: {{ company.offer_count }}</p>
                    <p class="mr-lg-0 mr-2">
                      СДЕЛКИ: {{ company.object_count }}
                    </p>
                    <p class="mr-lg-0 mr-2 broker">
                      брокер: Котлинов Павел Джавович
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CompanyCategories } from "@/const/Const";
import Progress from "@/components/common/Progress";
export default {
  name: "CompanyGridView",
  components: {
    Progress,
  },
  props: {
    companies: {
      type: Array,
    },
  },
  methods: {
    percentClass(percent) {
      if (percent < 30) {
        return "bg-danger";
      } else if (percent < 60) {
        return "bg-warning";
      } else if (percent < 90) {
        return "bg-primary";
      } else if (percent <= 100) {
        return "bg-success";
      }
    },
    category(categoryValue) {
      return CompanyCategories.get("param")[categoryValue][1];
    },
  },
};
</script>

<style></style>
