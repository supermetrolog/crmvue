<template>
  <div class="row no-gutters company-detail-info">
    <div class="col-12">
      <div class="row">
        <div class="col-12 text-center mb-3">
          <p class="d-inline-block pl-2 status">
            <span
              :class="{
                'bg-dark': !company.active,
                'bg-success': company.active,
              }"
              >{{ status }}</span
            >
          </p>
          <p
            class="d-inline-block pl-2 pb-2 category"
            v-for="categoryItem of company.categories"
            :key="categoryItem.id"
          >
            <span>{{ category(categoryItem.category) }}</span>
          </p>
        </div>
        <div class="col-12 text-center">
          <Progress :percent="company.progress_percent" />
        </div>
      </div>
    </div>
    <div class="col-12 text-center p-3">
      <h3 v-if="!company.noName">
        {{ company.nameRu }} - {{ company.nameEng }}
      </h3>
    </div>
    <div class="col-12">
      <div class="row no-gutters">
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-3">
              <strong> Адрес: </strong>
            </div>
            <div class="col-9 text-right align-self-center">
              <p>
                {{ company.officeAdress || "&#8212;" }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-4">
              <strong>Телефон: </strong>
            </div>
            <div class="col-8 text-right align-self-center">
              <template v-if="contactsTypeGeneralPhone[0]">
                <a
                  v-for="phone of contactsTypeGeneralPhone"
                  :key="phone"
                  :href="'tel:' + phone.phone"
                >
                  {{ phone.phone }}
                </a>
              </template>
              <p v-if="!contactsTypeGeneralPhone[0]">&#8212;</p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-4">
              <strong>Email: </strong>
            </div>
            <div class="col-8 text-right align-self-center">
              <a
                v-for="email of contactsTypeGeneralEmail"
                :key="email"
                :href="'mailto:' + email.email"
              >
                {{ email.email }}
              </a>
              <p v-if="!contactsTypeGeneralEmail[0]">&#8212;</p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-4">
              <strong>Вебсайт: </strong>
            </div>
            <div class="col-8 text-right align-self-center">
              <a
                v-for="(website, index) of contactsTypeGeneralWebsite"
                :key="index"
                :href="website.website"
              >
                {{ website.website }}
              </a>
              <p v-if="!contactsTypeGeneralWebsite[0]">&#8212;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="row no-gutters">
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <strong>ГК: </strong>
            </div>
            <div class="col-7 text-right align-self-center">
              <p v-if="company.companyGroup">
                {{ company.companyGroup.nameRu }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <strong>Форма Организации: </strong>
            </div>
            <div class="col-7 text-right align-self-center">
              <p>
                {{ company.formOfOrganization || "&#8212;" }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <strong>Группа деятельности: </strong>
            </div>
            <div class="col-7 text-right align-self-center">
              <p>
                {{ company.activityGroup }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <strong>Профиль деятельности: </strong>
            </div>
            <div class="col-7 text-right align-self-center">
              <p>
                {{ company.activityProfile }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="col-12 company-detail-info-item"
          :class="{ 'product-range': company.productRanges.length }"
        >
          <div class="row no-gutters">
            <div class="col-5">
              <strong>Наменклатура товара: </strong>
            </div>
            <div class="col-7 text-right align-self-center">
              <p
                class="d-inline-block"
                v-for="product of company.productRanges"
                :key="product.id"
              >
                {{ product.product }}
              </p>
              <p class="d-inline-block" v-if="!company.productRanges.length">
                &#8212;
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-3">
              <strong>Внес: </strong>
            </div>
            <div class="col-9 text-right align-self-center">
              <p>
                {{ company.consultant.username }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-4">
              <strong>Поступление: </strong>
            </div>
            <div class="col-8 text-right align-self-center">
              <p>
                {{ company.created_at }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-4">
              <strong v-if="company.updated_at">Обновление: </strong>
            </div>
            <div class="col-8 text-right align-self-center">
              <p v-if="company.updated_at">
                {{ company.updated_at }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-4">
              <strong>Описание: </strong>
            </div>
            <div class="col-8 text-right align-self-center">
              <p v-if="company.description">
                {{ company.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-4">
              <strong>Документы: </strong>
            </div>
            <div
              class="col-8 text-right align-self-center"
              v-if="company.files.length"
            >
              <FileInput
                :alreadyExistingFiles="company.files"
                :reedOnly="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 text-center mt-3">
      <h4
        class="requisistes-show-btn"
        @click.prevent="toggleRequisistesVisible"
      >
        дополнительно
        <i class="fas fa-sort-down visible" v-if="!requisistesVisible"></i>
        <i class="fas fa-sort-up unvisible" v-else></i>
      </h4>
    </div>
    <div class="col-12 requisistes pt-3" v-show="requisistesVisible">
      <div class="row">
        <div class="col-12">
          <div class="row no-gutters">
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>Юр. адрес: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.legalAddress }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>ОГРН: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p class="text-primary">
                    {{ company.ogrn }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>ИНН: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.inn }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>КПП: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.kpp }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>БИК: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.bik }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>ОКПО: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.okpo }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>ОКВЭД: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.okved }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row no-gutters">
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>Рсч/сч: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.checkingAccount }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>Крсп/сч: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.correspondentAccount }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>В банке: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.inTheBank }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Имя подписанта: </strong>
                </div>
                <div class="col-7 text-right align-self-center">
                  <p>
                    {{ company.signatoryName }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Фамилия подписанта: </strong>
                </div>
                <div class="col-7 text-right align-self-center">
                  <p>
                    {{ company.signatoryMiddleName }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Отчество подписанта: </strong>
                </div>
                <div class="col-7 text-right align-self-center">
                  <p>
                    {{ company.signatoryLastName }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-3">
                  <strong>№ документа: </strong>
                </div>
                <div class="col-9 text-right align-self-center">
                  <p>
                    {{ company.documentNumber }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Действует на основе: </strong>
                </div>
                <div class="col-7 text-right align-self-center">
                  <p>
                    {{ company.basis }}
                  </p>
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
import FileInput from "@/components/FileInput";
import Progress from "@/components/Progress";
export default {
  name: "CompanyDetailInfo",
  components: {
    Progress,
    FileInput,
  },
  data() {
    return {
      requisistesVisible: false,
    };
  },
  props: {
    company: {
      type: Object,
    },
  },
  computed: {
    status() {
      return this.company.active ? "Автив" : "Пассив";
    },
    contactsTypeGeneralPhone() {
      const contacts = this.company.contacts.filter((item) => item.type != 0);
      return contacts[0] ? contacts[0].phones : false;
    },
    contactsTypeGeneralEmail() {
      const contacts = this.company.contacts.filter((item) => item.type != 0);
      return contacts[0] ? contacts[0].emails : false;
    },
    contactsTypeGeneralWebsite() {
      const contacts = this.company.contacts.filter((item) => item.type != 0);
      return contacts[0] ? contacts[0].websites : false;
    },
  },
  methods: {
    category(categoryValue) {
      return CompanyCategories.get("param")[categoryValue][1];
    },
    toggleRequisistesVisible() {
      this.requisistesVisible = !this.requisistesVisible;
    },
  },
};
</script>

<style>
</style>