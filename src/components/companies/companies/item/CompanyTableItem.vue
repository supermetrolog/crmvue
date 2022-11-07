<template>
  <Tr class="company-table-view CompanyTableItem">
    <Td class="text-center p-0">
      {{ company.id }}
    </Td>
    <Td class="name column" sort="nameRu">
      <router-link :to="'/companies/' + company.id" target="_blank">
        <h4 class="d-inline" :class="{ 'text-warning': !company.status }">
          {{ company.full_name }}
        </h4>
      </router-link>
      <span class="name-type" v-if="company.activityProfile !== null">{{
        activityProfileOptions[company.activityProfile].label
      }}</span>
      <div>
        <i
          v-for="rating in ratingOptions"
          :key="rating[0]"
          class="text-warning far fa-star"
          :class="{
            'fas fa-star': company.rating >= rating[0],
          }"
        >
        </i>
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
      <template v-if="company.mainContact">
        <p
          v-if="
            !company.mainContact.phones.length &&
            !company.mainContact.emails.length
          "
        >
          &#8212;
        </p>
        <p class="name">{{ company.mainContact.first_and_last_name }}</p>
        <p
          class="position"
          v-if="
            company.mainContact &&
            !company.mainContact.position_unknown &&
            positionOptions.find(
              (item) => item.value == company.mainContact.position
            )
          "
        >
          {{
            positionOptions.find(
              (item) => item.value == company.mainContact.position
            ).label
          }}
        </p>
        <a
          :href="'mailto:' + email.email"
          v-for="email of company.mainContact.emails"
          :key="email.email"
          class="d-block"
        >
          {{ email.email }}
        </a>
        <PhoneNumber
          v-for="phone of company.mainContact.phones"
          :key="phone.id"
          :phone="phone"
          :contact="company.mainContact"
        />
      </template>
      <p v-else>&#8212;</p>
    </Td>
    <Td class="text-center">бла</Td>
    <Td class="text-center CompanyTableItem-consultant">
      {{ company.consultant.userProfile.short_name }}
    </Td>
    <Td class="CompanyTableItem-notif text-warning">Пора позвонить клиенту</Td>
    <Td class="text-center date" sort="created_at">
      {{ formattedDate }}
    </Td>
  </Tr>
  <Tr class="CompanyTableItem-dropdown">
    <td></td>
    <td colspan="5" class="p-0 m-0">
      <div>
        <div class="CompanyTableItem-block">
          <div class="CompanyTableItem-block-actions">
            <button
              class="CompanyTableItem-block-actions-button"
              @click="requestsIsOpen = !requestsIsOpen"
            >
              <i class="fa fa-chevron-down" v-if="!requestsIsOpen"></i>
              <i class="fa fa-chevron-up" v-if="requestsIsOpen"></i>
              Запросы ({{ activeRequests.length
              }}{{
                archiveRequests.length ? `/${archiveRequests.length}` : ""
              }})
            </button>
            <button
              class="CompanyTableItem-block-actions-button text-warning"
              @click="objectsIsOpen = !objectsIsOpen"
              v-if="company.objects.length"
            >
              <i class="fa fa-chevron-down" v-if="!objectsIsOpen"></i>
              <i class="fa fa-chevron-up" v-if="objectsIsOpen"></i>
              Объекты ({{ company.objects.length }})
            </button>
          </div>
          <div v-if="requestsIsOpen">
            <div
              style="margin-bottom: 10px"
              v-for="activeRequest in activeRequests"
              :key="activeRequest.id"
            >
              <CompanyTableMiniTimeline
                @click="clickTimeline(activeRequest)"
                class="CompanyTableItem-block-timeline"
                v-for="timeline in activeRequest.timelines"
                :key="timeline"
                :currentSteps="timeline.timelineSteps"
                :requestName="activeRequest.format_name"
              />
              <hr v-if="activeRequest.timelines.length > 1" />
            </div>
          </div>
          <button
            class="CompanyTableItem-button"
            @click="archiveRequestsIsOpen = !archiveRequestsIsOpen"
            v-if="requestsIsOpen && archiveRequests.length"
          >
            <i class="fa fa-chevron-down" v-if="!archiveRequestsIsOpen"></i>
            <i class="fa fa-chevron-up" v-if="archiveRequestsIsOpen"></i>
            Архивные ({{ archiveRequests.length }})
          </button>
          <div v-if="requestsIsOpen && archiveRequestsIsOpen">
            <div
              v-for="archiveRequest in archiveRequests"
              :key="archiveRequest.id"
            >
              <CompanyTableMiniTimeline
                style="margin-bottom: 10px"
                @click="clickTimeline(archiveRequest)"
                class="CompanyTableItem-block-timeline"
                v-for="timeline in archiveRequest.timelines"
                :key="timeline"
                :currentSteps="timeline.timelineSteps"
                :requestName="archiveRequest.format_name"
              />
              <hr v-if="archiveRequest.timelines.length > 1" />
            </div>
          </div>
        </div>
        <div
          class="CompanyTableItem-block"
          v-if="company.objects.length && objectsIsOpen"
        >
          <button
            class="CompanyTableItem-button text-warning"
            @click="objectsIsOpen = !objectsIsOpen"
          >
            <i class="fa fa-chevron-down" v-if="!objectsIsOpen"></i>
            <i class="fa fa-chevron-up" v-if="objectsIsOpen"></i>
            Объекты ({{ company.objects.length }})
          </button>
          <div v-if="objectsIsOpen">
            <CompanyTableObjectItem
              :object="object"
              v-for="object in company.objects"
              :key="object.id"
            />
          </div>
        </div>
        <!-- <div>
          <button
            class="CompanyTableItem-button"
            @click="objectsIsOpen = !objectsIsOpen"
          >
            <i class="fa fa-chevron-down" v-if="!objectsIsOpen"></i>
            <i class="fa fa-chevron-up" v-if="objectsIsOpen"></i>
            Услуги ({{ company.requests.length }})
          </button>
        </div> -->
      </div>
    </td></Tr
  >
</template>

<script>
import CompanyTableMiniTimeline from "./CompanyTableMiniTimeline.vue";
import CompanyTableObjectItem from "../../objects/company-objects/table-objects/CompanyTableObjectItem.vue";
import { Timeline } from "@/const/Const";
import { MixinCompanyView } from "../mixins";
import Tr from "@/components/common/table/Tr";
import Td from "@/components/common/table/Td";
import { mapGetters } from "vuex";
import moment from "moment";
import { ActivityProfileList } from "@/const/Const";

export default {
  mixins: [MixinCompanyView],
  name: "CompanyTableItem",
  components: {
    Tr,
    Td,
    CompanyTableObjectItem,
    CompanyTableMiniTimeline,
  },
  props: {
    company: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      steps: Timeline.get("param"),
      requestsIsOpen: false,
      archiveRequestsIsOpen: false,
      objectsIsOpen: false,
      activityProfileOptions: ActivityProfileList.get("param"),
    };
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
    activeRequests() {
      return this.company.requests.filter((request) => request.status === 1);
    },
    archiveRequests() {
      return this.company.requests.filter((request) => request.status === 2);
    },
    formattedDate() {
      let date = new Date(this.company.created_at);
      return moment(date).format("DD-MM-YYYY");
    },
  },
  methods: {
    clickTimeline(request) {
      let route = this.$router.resolve({
        path: `/companies/${this.company.id}`,
        query: {
          request_id: request.id,
          consultant_id: this.THIS_USER.id,
          step: 0,
        },
      });
      window.open(route.href);
    },
  },
};
</script>