<template>
  <div class="company-request-search-form">
    <Form class="autosize px-md-5" @submit="onSubmit">
      <FormGroup class="mb-2">
        <Input
          v-model="form.all"
          label="Поиск"
          placeholder="ID, адрес, собственник, телефон, ФИО"
          class="col-12 main-input"
          @keydown.enter="onSubmit"
        />
      </FormGroup>
      <FormGroup>
        <a
          href="#"
          @click.prevent="extraVisible = !extraVisible"
          class="text-primary"
        >
          фильтры
          <span class="badge badge-danger" v-if="filterCount">
            {{ filterCount }}
          </span>
          <i class="fas fa-angle-down" v-if="!extraVisible"></i>
          <i class="fas fa-angle-up" v-else></i>
        </a>
        <a
          href="#"
          class="text-primary ml-5 favorites"
          @click.prevent="clickFavorites"
          :class="{ selected: form.favorites }"
        >
          избранные
          <span class="badge badge-info" v-if="favoritesCount">
            {{ favoritesCount }}
          </span>
        </a>
        <a
          href="#"
          @click.prevent="resetForm"
          class="text-warning ml-5"
          v-if="filterCount"
        >
          сбросить
        </a>
      </FormGroup>
      <div v-show="extraVisible">
        <FormGroup class="mb-2">
          <MultiSelect
            v-model="form.agent_id"
            label="Консультант"
            class="col-12 col-md-4 pr-md-1"
            :options="
              async () => {
                return await FETCH_CONSULTANT_LIST();
              }
            "
          />

          <MultiSelect
            v-model="form.deal_type"
            label="Тип сделки"
            class="col-md-2 col-12 pr-md-1"
            :options="dealTypeList"
          />
          <Input
            v-if="typeof form.approximateDistanceFromMKAD == 'undefined'"
            v-model="form.rangeMaxDistanceFromMKAD"
            maska="###"
            placeholder="не более"
            label="Удаленность от МКАД"
            class="col-md-3 col-12 pr-md-1"
          />
          <Input
            v-else
            v-model="form.approximateDistanceFromMKAD"
            maska="###"
            placeholder="не более"
            label="Удаленность от МКАД +30%"
            class="col-md-3 col-12 pr-md-1"
          />
          <Input
            v-model="form.rangeMinElectricity"
            placeholder="не менее"
            maska="##########"
            label="Электричесвто (квт)"
            class="col-md-3 col-12"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Input
            v-model="form.rangeMinArea"
            maska="##########"
            label="S пола (м^2)"
            placeholder="От:"
            class="col-md-3 col-6 pr-md-1 pt-4 pt-md-0"
          >
            <Input
              v-model="form.rangeMaxArea"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Input
            v-model="form.rangeMinPricePerFloor"
            maska="##########"
            placeholder="От:"
            label="Цена (продажи, аренды, о-х)"
            class="col-md-3 col-6 pr-md-1"
          >
            <Input
              v-model="form.rangeMaxPricePerFloor"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <Input
            v-model="form.rangeMinCeilingHeight"
            maska="##########"
            label="Высота потолков"
            placeholder="От:"
            class="col-md-3 col-6 pr-1"
          >
            <Input
              v-model="form.rangeMaxCeilingHeight"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
          </Input>
          <MultiSelect
            v-model="form.region"
            label="Регионы"
            class="col-md-3 col-6"
            mode="multiple"
            :options="
              async () => {
                await this.FETCH_REGION_LIST();
                return this.REGION_LIST;
              }
            "
            @change="changeRegion"
          >
            <template v-if="REGION_LIST">
              <small
                v-for="(region, index) in form.region"
                :key="region"
                class="d-block px-3"
              >
                {{ index + 1 }}.
                {{ REGION_LIST.find((item) => item.value == region).label }}
              </small>
            </template>
            <Radio
              v-if="form.region.find((item) => item == 6)"
              v-model="form.outside_mkad"
              :unselectMode="true"
              class="col-12 large p-0"
              :options="outsideMkadOptions"
            />
            <Checkbox
              v-if="form.region.find((item) => item == 6)"
              v-model="form.district_moscow"
              class="col-12 p-0"
              label="Округа Москвы"
              :options="districtList"
            />
            <Checkbox
              v-if="form.region.find((item) => item == 1)"
              v-model="form.direction"
              class="col-12 p-0"
              label="Направления МО"
              :options="directionList"
            />
          </MultiSelect>
        </FormGroup>
        <FormGroup class="mb-2">
          <Checkbox
            v-model="form.class"
            class="col-md-2 col-4 pr-1"
            label="Классы"
            :options="objectClassList"
          />
          <Checkbox
            v-model="form.gates"
            class="col-4 pr-1"
            label="Тип ворот"
            :options="gateTypeList"
          />
          <Checkbox
            v-model="form.floor_types"
            class="col-4 pr-1"
            label="Тип пола"
            :options="floorTypesFUCKOptions"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Checkbox
            v-model="form.water"
            class="col-md col-3 large text-center"
            label="Вода"
          />
          <Checkbox
            v-model="form.gas"
            class="col-md col-3 large text-center"
            label="Газ"
          />
          <Checkbox
            v-model="form.steam"
            class="col-md col-3 large text-center"
            label="Пар"
          />
          <Checkbox
            v-model="form.sewage_central"
            class="col-md col-3 large text-center"
            label="КНС"
          />
          <Checkbox
            v-model="form.racks"
            class="col-md col-4 large text-center"
            label="Стеллажи"
          />
          <Checkbox
            v-model="form.railway"
            class="col-md col-4 large text-center"
            label="Ж/Д ветка"
          />
          <Checkbox
            v-model="form.has_cranes"
            class="col-md col-4 large text-center"
            label="Краны"
          />
        </FormGroup>
        <FormGroup class="mb-2">
          <Radio
            v-model="form.status"
            :options="activePassiveOptions"
            :unselectMode="true"
            label="Статус"
            class="col pr-1 text-center"
          />
          <Radio
            v-model="form.heated"
            :unselectMode="true"
            label="Отапливаемый"
            class="col text-center pr-1"
            :options="yesNoFUCKOptions"
          />
          <Checkbox
            v-model="form.firstFloorOnly"
            class="col pr-1 large text-center"
            label="Только 1 этаж"
          />
        </FormGroup>
        <FormGroup class="mb-3">
          <CheckboxIcons
            v-model="form.purposes"
            label="Тип объекта"
            extraLabel="склад"
            :noAllSelect="true"
            :extraValue="1"
            :extraOptions="form.object_type"
            @extraSelect="selectObjectType"
            class="col-md-4 col-12 pr-2 mx-auto"
            :options="objectTypeListWareHouse"
          />
          <CheckboxIcons
            v-model="form.purposes"
            extraLabel="производство"
            :noAllSelect="true"
            :extraValue="2"
            :extraOptions="form.object_type"
            @extraSelect="selectObjectType"
            class="col-md-4 col-12 mt-4 pr-2 mx-auto"
            :options="objectTypeListProduction"
          />
          <CheckboxIcons
            v-model="form.purposes"
            extraLabel="участок"
            :noAllSelect="true"
            :extraValue="3"
            :extraOptions="form.object_type"
            @extraSelect="selectObjectType"
            class="col-md-4 col-12 mt-4 mx-auto"
            :options="objectTypeListPlot"
          />
        </FormGroup>

        <FormGroup>
          <div class="col-12 text-center">
            <h3 class="m-0">Реклама</h3>
          </div>
        </FormGroup>
        <FormGroup class="mb-2">
          <Radio
            v-model="form.ad_realtor"
            :unselectMode="true"
            label="Realtor.ru"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.ad_cian"
            :unselectMode="true"
            label="Циан"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.ad_yandex"
            :unselectMode="true"
            label="Яндекс"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
          <Radio
            v-model="form.ad_free"
            :unselectMode="true"
            label="Бесплатные"
            class="col pr-1 text-center"
            :options="yesNoOptions"
          />
        </FormGroup>
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import Radio from "@/components/common/form/Radio.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
import { SearchFormMixin } from "@/components/common/mixins.js";
import { mapActions, mapGetters } from "vuex";
import {
  DealTypeList,
  ObjectClassList,
  GateTypeList,
  YesNoFUCK,
  YesNo,
  FloorTypesFUCK,
  ObjectTypeList,
  RegionList,
  DirectionList,
  DistrictList,
  ActivePassiveFUCK,
  OutsideMkad,
} from "@/const/Const.js";
export default {
  mixins: [SearchFormMixin],
  name: "OfferSearchForm",
  components: {
    Form,
    FormGroup,
    Input,
    MultiSelect,
    Checkbox,
    Radio,
    CheckboxIcons,
  },
  data() {
    return {
      dealTypeList: DealTypeList.get("param"),
      objectClassList: ObjectClassList.get("param"),
      gateTypeList: GateTypeList.get("param"),
      yesNoFUCKOptions: YesNoFUCK.get("param"),
      yesNoOptions: YesNo.get("param"),
      outsideMkadOptions: OutsideMkad.get("param"),
      floorTypesFUCKOptions: FloorTypesFUCK.get("param"),
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
      regionList: RegionList.get("param"),
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      activePassiveOptions: ActivePassiveFUCK.get("param"),
    };
  },
  computed: {
    ...mapGetters(["FAVORITES_OFFERS", "REGION_LIST"]),
    favoritesCount() {
      return this.FAVORITES_OFFERS.length;
    },
  },
  defaultFormProperties: {
    all: null,
    rangeMinElectricity: null,
    rangeMaxDistanceFromMKAD: null,
    deal_type: null,
    agent_id: null,
    rangeMaxArea: null,
    rangeMinArea: null,
    rangeMaxPricePerFloor: null,
    rangeMinPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    class: [],
    gates: [],
    heated: null,
    water: null,
    gas: null,
    steam: null,
    sewage_central: null,
    racks: null,
    railway: null,
    has_cranes: null,
    floor_types: [],
    purposes: [],
    object_type: [],
    region: [],
    direction: [],
    district_moscow: [],
    status: null,
    firstFloorOnly: null,
    ad_realtor: null,
    ad_cian: null,
    ad_yandex: null,
    ad_free: null,
    favorites: null,
    outside_mkad: null,
    region_neardy: null,
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST", "FETCH_REGION_LIST"]),
    async setQueryFields() {
      this.form = { ...this.form, ...this.$route.query };
      if (this.form.purposes && !Array.isArray(this.form.purposes)) {
        this.form.purposes = [this.form.purposes];
      }
      if (this.form.class && !Array.isArray(this.form.class)) {
        this.form.class = [this.form.class];
      }
      if (this.form.gates && !Array.isArray(this.form.gates)) {
        this.form.gates = [this.form.gates];
      }
      if (this.form.region && !Array.isArray(this.form.region)) {
        this.form.region = [this.form.region];
      }
      if (this.form.direction && !Array.isArray(this.form.direction)) {
        this.form.direction = [this.form.direction];
      }
      if (
        this.form.district_moscow &&
        !Array.isArray(this.form.district_moscow)
      ) {
        this.form.district_moscow = [this.form.district_moscow];
      }
      if (this.form.object_type && !Array.isArray(this.form.object_type)) {
        this.form.object_type = [this.form.object_type];
      }

      if (this.form.floor_types && !Array.isArray(this.form.floor_types)) {
        this.form.floor_types = [this.form.floor_types];
      }
      let array = [];
      this.form.purposes.forEach((item) => {
        array.push(+item);
      });
      this.form.purposes = array;
      array = [];
      this.form.object_type.forEach((item) => {
        array.push(+item);
      });
      this.form.object_type = array;
      let query = { ...this.form };
      this.deleteEmptyFields(query);
      await this.$router.replace({ query });
    },
    changeRegion() {
      if (this.form.region == null) {
        this.form.direction = [];
        this.form.district_moscow = [];
      }
      if (!this.form.region.find((item) => item == 1)) {
        this.form.direction = [];
        this.form.region_neardy = null;
      }
      if (!this.form.region.find((item) => item == 6)) {
        this.form.district_moscow = [];
        this.form.outside_mkad = null;
      }
    },
    selectObjectType(isSelected, type) {
      this.form.object_type = this.form.object_type.filter(
        (item) => item != type
      );
      if (isSelected) {
        this.form.object_type.push(type);
      }
      console.log(isSelected, type);
    },
    clickFavorites() {
      if (this.form.favorites) {
        this.form.favorites = null;
      } else {
        this.form.favorites = 1;
      }
    },
  },
};
</script>

<style>
</style>