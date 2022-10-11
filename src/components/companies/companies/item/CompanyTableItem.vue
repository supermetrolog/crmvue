<template>
  <Tr class="company-table-view CompanyTableItem">
    <Td class="text-center p-0">
      {{ company.id }}
    </Td>
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
            {{ request.format_name }}
          </span>
          <p v-if="!company.requests.length">&#8212;</p>
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
  <Tr
    ><td colspan="9">
      <div>
        <div class="CompanyTableItem-block">
          <button
            class="CompanyTableItem-button"
            @click="requestsIsOpen = !requestsIsOpen"
          >
            <i class="fa fa-chevron-down" v-if="!requestsIsOpen"></i>
            <i class="fa fa-chevron-up" v-if="requestsIsOpen"></i>
            Запросы ({{ company.requests.length }})
          </button>
          <div v-if="requestsIsOpen">
            <div
              style="margin-bottom: 10px"
              v-for="request in company.requests"
              :key="request.id"
            >
              <MiniTimeline
                :currentSteps="timeline.timelineSteps"
                v-for="timeline in request.timelines"
                :key="timeline"
              />
            </div>
          </div>
        </div>
        <div class="CompanyTableItem-block" v-if="company.objects.length">
          <button
            class="CompanyTableItem-button"
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
import CompanyTableObjectItem from "../../objects/company-objects/table-objects/CompanyTableObjectItem.vue";
import MiniTimeline from "./MiniTimeline.vue";
import { Timeline } from "@/const/Const";
import { MixinCompanyView } from "../mixins";
import Tr from "@/components/common/table/Tr";
import Td from "@/components/common/table/Td";
export default {
  mixins: [MixinCompanyView],
  name: "CompanyTableItem",
  components: {
    Tr,
    Td,
    MiniTimeline,
    CompanyTableObjectItem,
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
      requestsIsOpen: true,
      objectsIsOpen: false,
    };
  },
};
</script>