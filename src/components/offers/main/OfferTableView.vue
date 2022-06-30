<template>
  <div class="offer-table-view">
    <Table>
      <template #thead>
        <Tr>
          <Th>#</Th>
          <Th></Th>
          <Th>регион</Th>
          <Th sort="from_mkad">мкад</Th>
          <Th sort="area">площадь</Th>
          <Th sort="price">цена</Th>
          <Th>cобственник</Th>
          <Th>консультант</Th>
          <Th>реклама</Th>
          <Th sort="last_update">обновление</Th>
          <Th sort="status">статус</Th>
        </Tr>
      </template>
      <template #tbody>
        <Loader v-if="loader" class="center" />
        <Tr
          v-for="offer in offers"
          :key="offer.id"
          :class="{ passive: offer.status != 1 }"
        >
          <Td class="id" :class="{ passive: offer.status != 1 }">
            {{ offer.visual_id }}
          </Td>
          <Td class="photo">
            <a :href="getOfferUrl(offer)" target="_blank">
              <div class="image-container">
                <img :src="imageSrc(offer)" alt="image" />
                <span class="deal_type" :class="{ passive: offer.status != 1 }">
                  {{ offer.deal_type_name }}
                </span>
                <span class="object_class">
                  {{ offer.class_name }}
                </span>
                <span class="test_only" v-if="offer.test_only">
                  Тестовый лот
                </span>
              </div>
            </a>
          </Td>
          <Td class="region">
            <p class="region_item" v-if="offer.region_name">
              {{ offer.region_name }}
            </p>
            <p v-if="offer.district_name">
              {{ offer.district_name }}
            </p>
            <p v-if="offer.district_moscow_name">
              {{ offer.district_moscow_name }}
            </p>
            <p v-if="offer.direction_name">
              {{ offer.direction_name }}
            </p>
            <p v-if="offer.town_name">
              {{ offer.town_name }}
            </p>
            <p v-if="offer.highway_name">
              {{ offer.highway_name }} <small>шоссе</small>
            </p>
            <p v-if="offer.highway_moscow_name">
              {{ offer.highway_moscow_name }} <small>шоссе</small>
            </p>
            <hr />
            <p v-if="offer.address">
              {{ offer.address }}
            </p>
          </Td>
          <Td class="from_mkad" sort="from_mkad">
            <!-- {{ offer.gates }} -->
            <p v-if="offer.from_mkad">
              {{ offer.from_mkad }} <small>км</small>
            </p>
            <p v-else>—</p>
          </Td>
          <Td class="area" sort="area">
            <p>
              {{ offer.calc_area_general }}
              <small>м<sup>2</sup></small>
            </p>
          </Td>
          <Td class="price" sort="price">
            <p v-if="offer.deal_type == 1 || offer.deal_type == 4">
              {{ offer.calc_price_warehouse }}
              <small>руб за м<sup>2</sup>/г</small>
            </p>
            <p v-if="offer.deal_type == 2">
              {{ offer.calc_price_sale }} <small>руб за м<sup>2</sup></small>
            </p>
            <p v-if="offer.deal_type == 3">
              {{ offer.calc_price_safe_pallet }} <small>руб за 1 п. м.</small>
            </p>
            <span
              v-if="
                offer.generalOffersMix && offer.generalOffersMix.offer.tax_form
              "
            >
              {{
                taxFormList.find(
                  (item) => item.value == offer.generalOffersMix.offer.tax_form
                ).label
              }}
            </span>
          </Td>
          <Td class="company">
            <template v-if="offer.company !== null">
              <router-link
                :to="'/companies/' + offer.company.id"
                target="_blank"
              >
                {{ offer.company.full_name }}
              </router-link>
              <div class="contact" v-if="offer.company.mainContact">
                {{ offer.company.mainContact.full_name }}
                <a
                  :href="'mailto:' + email.email"
                  v-for="email of offer.company.mainContact.emails"
                  :key="email.email"
                  class="d-block"
                >
                  {{ email.email }}
                </a>
                <PhoneNumber
                  v-for="phone of offer.company.mainContact.phones"
                  :key="phone.id"
                  :phone="phone"
                  :contact="offer.company.mainContact"
                />
              </div>
            </template>
          </Td>
          <Td class="consultant">
            <p v-if="offer.consultant">
              {{ offer.consultant.userProfile.full_name }}
            </p>
          </Td>
          <Td class="add">
            <p v-if="offer.ad_realtor">Realtor.ru</p>
            <p v-if="offer.ad_cian">Циан</p>
            <p v-if="offer.ad_yandex">Яндекс</p>
            <p v-if="offer.ad_free">Бесплатные</p>
          </Td>
          <Td class="date" sort="last_update">
            {{ offer.last_update_format }}
          </Td>
          <Td class="status" sort="status">
            <h4 class="text-success" v-if="offer.status == 1">Актив</h4>
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
import {
  DirectionList,
  DistrictList,
  RegionList,
  TaxFormList,
} from "@/const/Const.js";
export default {
  name: "OfferTableView",
  components: {
    Table,
    Tr,
    Th,
    Td,
  },
  data() {
    return {
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      regionList: RegionList.get("param"),
      taxFormList: TaxFormList,
    };
  },
  props: {
    offers: {
      type: Array,
    },
    loader: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    // imageSrc(offer) {
    //   const photos = offer.photos;
    //   const object_photos = offer.object.photo;
    //   if (photos && Array.isArray(photos) && photos[0] != "[]") {
    //     return "https://pennylane.pro" + photos[0];
    //   } else if (
    //     object_photos &&
    //     Array.isArray(object_photos) &&
    //     object_photos[0] != "[]"
    //   ) {
    //     return "https://pennylane.pro" + object_photos[0];
    //   } else {
    //     return this.$apiUrlHelper.fileNotFoundUrl();
    //   }
    // },
    imageSrc(offer) {
      const photos = offer.photos;
      const object_photos = offer.object.photo;
      let resultImage = null;
      if (photos && Array.isArray(photos)) {
        photos.forEach((img) => {
          if (resultImage == null && typeof img == "string" && img.length > 2) {
            resultImage = "https://pennylane.pro" + img;
          }
        });
      }

      if (resultImage) {
        return resultImage;
      }
      if (
        object_photos &&
        Array.isArray(object_photos) &&
        typeof object_photos[0] == "string" &&
        object_photos[0].length > 2
      ) {
        return "https://pennylane.pro" + object_photos[0];
      }
      return this.$apiUrlHelper.fileNotFoundUrl();
    },
    getRegion(region) {
      return this.regionList[region].label;
    },
    getDirection(direction) {
      return this.directionList[direction][2];
    },
    getDistrict(district) {
      return this.districtList[district][1];
    },
    getOfferUrl(offer) {
      const baseUrl = "https://pennylane.pro/complex/";
      let url = baseUrl + offer.complex_id;
      if (offer.generalOffersMix) {
        url += "?offer_id=[" + offer.generalOffersMix.original_id + "]";
      } else {
        url += "?offer_id=[" + offer.original_id + "]";
      }
      return url;
    },
  },
  mounted() {},
};
</script>

<style>
</style>