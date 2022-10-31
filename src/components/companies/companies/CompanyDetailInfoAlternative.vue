<template>
  <div class="row no-gutters company-detail-info alt px-3 py-2" v-if="company">
    <div class="col-12 name d-flex justify-content-between">
      <h4 class="m-0">{{ company.id }} {{ company.full_name }}</h4>
      <i
        class="fas fa-pen text-primary edit"
        @click.prevent="clickUpdateCompany"
      ></i>
    </div>
    <div class="col-12">
      <div class="row no-gutters">
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Адрес:</p>
            </div>
            <div class="col-7 align-self-center">
              <strong>
                {{ company.officeAdress || "&#8212;" }}
              </strong>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Общий телефон:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong v-if="generalContact && generalContact.phones.length">
                <PhoneNumber
                  v-for="phone in generalContact.phones"
                  :key="phone.id"
                  :phone="phone"
                  :contact="generalContact"
                  classList="text-left"
                />
              </strong>
              <p v-else>&#8212;</p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Email:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <template v-if="generalContact && generalContact.emails.length">
                <a
                  v-for="email of generalContact.emails"
                  :key="email.id"
                  :href="'mailto:' + email.email"
                >
                  {{ email.email }}
                </a>
              </template>
              <p v-else>&#8212;</p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Вебсайт:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <template v-if="generalContact && generalContact.websites.length">
                <a
                  v-for="website of generalContact.websites"
                  :key="website.id"
                  :href="href(website.website)"
                  target="_blank"
                >
                  {{ website.website }}
                </a>
              </template>
              <p v-else>&#8212;</p>
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
              <p>ГК:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong v-if="company.companyGroup">
                {{ company.companyGroup.full_name }}
              </strong>
              <p v-else>&#8212;</p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Форма Организации:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong v-if="company.formOfOrganization !== null">
                {{
                  formOfOrganizationOptions[company.formOfOrganization].label
                }}
              </strong>
              <p v-else>&#8212;</p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Группа деятельности:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong v-if="company.activityGroup !== null">
                {{ activityGroupOptions[company.activityGroup].label }}
              </strong>
              <p v-else>&#8212;</p>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Профиль деятельности:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong v-if="company.activityProfile !== null">
                {{ activityProfileOptions[company.activityProfile].label }}
              </strong>
              <p v-else>&#8212;</p>
            </div>
          </div>
        </div>
        <div
          class="col-12 company-detail-info-item"
          :class="{ 'product-range-alt': company.productRanges.length }"
        >
          <div class="row no-gutters">
            <div class="col-5">
              <p>Номенклатура товара:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong
                class="d-inline-block"
                style="
                  line-break: anywhere;
                  white-space: break-spaces !important;
                "
                v-for="product of company.productRanges"
                :key="product.id"
              >
                {{ product.product }}
              </strong>
              <strong
                class="d-inline-block"
                v-if="!company.productRanges.length"
                style="
                  line-break: anywhere;
                  white-space: break-spaces !important;
                "
              >
                &#8212;
              </strong>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Внес:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong>
                {{ company.consultant.userProfile.short_name }}
              </strong>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Поступление:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong>
                {{ company.created_at_format }}
              </strong>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Обновление:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong>
                {{ company.updated_at_format || "&#8212;" }}
              </strong>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item">
          <div class="row no-gutters">
            <div class="col-5">
              <p>Обработано:</p>
            </div>
            <div class="col-7 text-left align-self-center">
              <strong>
                {{ company.processed ? "Да" : "Нет" }}
              </strong>
            </div>
          </div>
        </div>
        <div class="col-12 company-detail-info-item mt-4">
          <div class="row no-gutters">
            <p>
              {{ company.description || "&#8212;" }}
            </p>
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
                <div class="col-5">
                  <strong>Юр. адрес: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.legalAddress">
                    {{ company.legalAddress }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>ОГРН: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p class="text-primary" v-if="company.ogrn">
                    {{ company.ogrn }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>ИНН: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.inn">
                    {{ company.inn }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>КПП: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.kpp">
                    {{ company.kpp }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>БИК: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.bik">
                    {{ company.bik }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>ОКПО: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.okpo">
                    {{ company.okpo }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>ОКВЭД: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.okved">
                    {{ company.okved }}
                  </p>
                  <p v-else>&#8212;</p>
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
                  <strong>Рсч/сч: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.checkingAccount">
                    {{ company.checkingAccount }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Крсп/сч: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.correspondentAccount">
                    {{ company.correspondentAccount }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>В банке: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.inTheBank">
                    {{ company.inTheBank }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Имя подписанта: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.signatoryName">
                    {{ company.signatoryName }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Фамилия подписанта: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.signatoryMiddleName">
                    {{ company.signatoryMiddleName }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Отчество подписанта: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.signatoryLastName">
                    {{ company.signatoryLastName }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>№ документа: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.documentNumber">
                    {{ company.documentNumber }}
                  </p>
                  <p v-else>&#8212;</p>
                </div>
              </div>
            </div>
            <div class="col-12 company-detail-info-item">
              <div class="row no-gutters">
                <div class="col-5">
                  <strong>Действует на основе: </strong>
                </div>
                <div class="col-7 text-left align-self-center">
                  <p v-if="company.basis">
                    {{ company.basis }}
                  </p>
                  <p v-else>&#8212;</p>
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
import { MixinCompanyDetailInfo } from "./mixins";
export default {
  mixins: [MixinCompanyDetailInfo],
  name: "CompanyDetailInfoAlternative",
  components: {},
  methods: {
    clickUpdateCompany() {
      this.$emit("openCompanyFormForUpdate");
    },
  },
};
</script>