<template>
  <div class="request-table">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th>тип сделки</Th>
          <Th>площадь</Th>
          <Th>цена</Th>
          <Th>регион</Th>
          <Th>компания</Th>
          <Th>консультант</Th>
          <Th>дата обновления</Th>
          <Th>статус</Th>
        </Tr>
      </template>
      <template #tbody>
        <Tr v-for="request in requests" :key="request.id">
          <Td class="text-center pr-0">
            {{ request.id }}
          </Td>
          <Td class="dealType">
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
                  :class="{ 'text-grey': !request.status }"
                >
                  <b>срочный запрос</b>
                </p>
              </div>

              <div class="col-12">
                <Progress :percent="request.progress_percent" />
              </div>
            </div>
          </Td>
          <Td class="text-center area">
            <p>
              <b>
                {{ request.minArea }} - {{ request.maxArea }} м<sup>2</sup>
              </b>
            </p>
          </Td>
          <Td class="text-center price">
            <p>
              {{
                request.pricePerFloor
                  ? request.pricePerFloor + " р."
                  : "&#8212;"
              }}
            </p>
          </Td>
          <Td class="text-center location">
            <div>
              <p v-if="!request.regions.length">&#8212;</p>
              <div class="region">
                <p
                  v-for="(region, index) of request.regions"
                  :key="region.id"
                  class="d-inline"
                >
                  {{ getRegion(request, region.region, index) }}
                </p>
              </div>
              <div class="region-parameters" v-if="request.directions.length">
                <p class="d-inline"><b>Московская область: </b></p>
                <p
                  class="d-inline"
                  v-for="direction of request.directions"
                  :key="direction.id"
                >
                  {{ getDirection(direction.direction) }}
                </p>
              </div>
              <div class="region-parameters" v-if="request.districts.length">
                <p class="d-inline"><b>Москва: </b></p>
                <p
                  class="d-inline"
                  v-for="district of request.districts"
                  :key="district.id"
                >
                  {{ getDistrict(district.district) }}
                </p>
              </div>
              <div>
                <p v-if="!request.distanceFromMKADnotApplicable">
                  до {{ request.distanceFromMKAD }} км до МКАД
                </p>
              </div>
            </div>
          </Td>
          <Td class="text-center company">
            <router-link
              :to="'/companies/' + request.company.id"
              target="_blank"
              class="text-primary"
            >
              <p :class="{ 'text-warning': !request.company.status }">
                {{ request.company.full_name }}
              </p>
            </router-link>
          </Td>
          <Td class="text-center">
            <p>
              {{ request.consultant.userProfile.short_name }}
            </p>
          </Td>
          <Td class="text-center date">
            <p>
              {{ request.updated_at_format || request.created_at_format }}
            </p>
          </Td>
          <Td class="text-center status">
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
import {
  DealTypeList,
  RegionList,
  DirectionList,
  DistrictList,
  PassiveWhyRequest,
} from "@/const/Const.js";
import Progress from "@/components/common/Progress";
export default {
  name: "RequestTable",
  components: {
    Table,
    Tr,
    Th,
    Td,
    Progress,
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
  methods: {
    getRegion(request, region, index) {
      if (index != request.regions.length - 1) {
        return this.regionList[region].label + ", ";
      }
      return this.regionList[region].label;
    },
    getDirection(direction) {
      return this.directionList[direction][2] + ", ";
    },
    getDistrict(district) {
      return this.districtList[district][1] + ", ";
    },
  },
};
</script>

<style>
</style>