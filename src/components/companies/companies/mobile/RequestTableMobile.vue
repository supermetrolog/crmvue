<template>
  <div class="request-table">
    <Table>
      <template #thead>
        <Tr>
          <Th sort="dealType">тип сделки</Th>
          <Th sort="pricePerFloor">цена</Th>
          <Th sort="updated_at">дата обновления</Th>
          <Th sort="status">статус</Th>
        </Tr>
      </template>
      <template #tbody>
        <Loader v-if="loader" class="center" />
        <tr v-for="request in requests" :key="request.id">
          <td colspan="4" class="p-0">
            <div class="CompanyViewItem mt-3">
              <div class="text-center status col-12 px-0" sort="status">
                <h4 class="text-success" v-if="request.status == 1">Актив</h4>
                <span
                  class="badge badge-blue-green"
                  v-else-if="request.status == 2"
                >
                  Завершен
                </span>
                <span class="badge badge-warning" v-else> Пассив </span>
                <div class="passive-why" v-if="!request.status">
                  <p class="text-warning d-inline-block">
                    <b>{{ passiveWhyOptions[request.passive_why].label }}</b>
                    <span class="text-dark" v-if="request.passive_why_comment"
                      >: {{ request.passive_why_comment }}</span
                    >
                  </p>
                </div>
              </div>
              <div class="text-center col-12 px-0">
                {{ request.id }}
              </div>

              <div class="dealType mx-2" sort="dealType">
                <div class="row no-gutters">
                  <div class="col-6">
                    <h4 :class="{ 'text-warning': !request.status }">
                      {{ dealTypeList[request.dealType].label }}
                    </h4>
                  </div>
                  <div class="col-6 text-right">
                    <p
                      class="text-danger d-block"
                      v-if="request.expressRequest"
                      :class="{ 'text-grey': request.status !== 1 }"
                    >
                      <b>срочный запрос</b>
                    </p>
                  </div>

                  <div class="col-12">
                    <Progress
                      :percent="request.timeline_progress"
                      title="Обработано"
                    />
                  </div>
                </div>
              </div>
              <div class="text-center area">
                <p>
                  <b>
                    {{ $formatter.number(request.minArea) }} -
                    {{ $formatter.number(request.maxArea) }} м<sup>2</sup>
                  </b>
                </p>
              </div>
              <div class="text-center price" sort="pricePerFloor">
                <p v-if="request.pricePerFloor !== null">
                  {{ $formatter.currency(request.pricePerFloor) }}
                  <small class="text-grey"> м<sup>2</sup>/год </small>
                  <br />
                  {{ $formatter.currency(request.pricePerFloorMonth) }}
                  <small class="text-grey"> м<sup>2</sup>/месяц </small>
                </p>

                <p v-else>&#8212;</p>
              </div>
              <div class="text-center location">
                <div>
                  <p v-if="!request.regions.length">&#8212;</p>
                  <div class="region">
                    <p>
                      {{
                        request.regions
                          .map((elem) =>
                            this.$formatter.text().ucFirst(elem.info.title)
                          )
                          .join(", ")
                      }}
                    </p>
                  </div>
                  <div
                    class="region-parameters"
                    v-if="request.directions.length"
                  >
                    <p class="d-inline"><b>Московская область: </b></p>
                    <p class="d-inline">
                      {{
                        request.directions
                          .map((elem) => this.directionList[elem.direction][2])
                          .join(", ")
                      }}
                    </p>
                  </div>
                  <div
                    class="region-parameters"
                    v-if="request.districts.length"
                  >
                    <p class="d-inline"><b>Москва: </b></p>
                    <p class="d-inline">
                      {{
                        request.districts
                          .map((elem) => this.districtList[elem.district][1])
                          .join(", ")
                      }}
                    </p>
                  </div>
                  <div>
                    <p v-if="!request.distanceFromMKADnotApplicable">
                      до {{ request.distanceFromMKAD }} км до МКАД
                    </p>
                  </div>
                </div>
              </div>
              <div class="text-center company">
                <router-link
                  :to="'/companies/' + request.company.id"
                  target="_blank"
                  class="text-primary"
                >
                  <p :class="{ 'text-warning': !request.company.status }">
                    {{
                      request.company.full_name == "-"
                        ? "&#8212;"
                        : request.company.full_name
                    }}
                  </p>
                </router-link>
              </div>
              <br />
              <div class="text-center">
                <p>
                  {{ request.consultant.userProfile.short_name }}
                </p>
              </div>
              <div class="text-center date" sort="updated_at">
                <p>
                  {{ request.updated_at_format ?? "&#8212;" }}
                </p>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </Table>
  </div>
</template>

<script>
import Tr from "../../../common/table/Tr.vue";
import Table from "@/components/common/table/Table";
import Th from "@/components/common/table/Th";
import {
  DealTypeList,
  RegionList,
  DirectionList,
  DistrictList,
  PassiveWhyRequest,
} from "@/const/Const.js";
import Progress from "@/components/common/Progress";
export default {
  name: "RequestTableMobile",
  components: {
    Table,
    Th,
    Progress,
    Tr,
  },
  data() {
    return {
      dealTypeList: DealTypeList.get("param"),
      regionList: RegionList.get("param"),
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      passiveWhyOptions: PassiveWhyRequest.get("param"),
    };
  },
  props: {
    requests: {
      type: Array,
    },
    loader: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
</style>