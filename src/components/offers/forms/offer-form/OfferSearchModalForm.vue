<template>
  <div class="company-request-search-form">
    <Modal class="autosize" @close="$emit('close')" title="Фильтры">
      <template #header>
        <span class="badge badge-danger" v-if="filterCount">
          {{ filterCount }}
        </span>
      </template>
      <Form class="autosize" @submit="onSubmit">
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
          <div class="col-6">
            <a
              href="#"
              class="text-primary favorites"
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
              class="text-warning ml-md-5 ml-4"
              v-if="filterCount"
            >
              сбросить фильтры
            </a>
          </div>
          <div class="col-6 text-right">
            <a
              v-for="btn in additionalButtons"
              :key="btn.label"
              href="#"
              @click.prevent="$emit(btn.event)"
              :class="btn.classes"
            >
              {{ btn.label }}
            </a>
          </div>
        </FormGroup>
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
              v-if="typeof form.approximateMaxPricePerFloor == 'undefined'"
              v-model="form.rangeMaxPricePerFloor"
              maska="##########"
              placeholder="До:"
              class="col-12 p-0 pt-1"
            />
            <Input
              v-else
              v-model="form.approximateMaxPricePerFloor"
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
            v-model="form.fakeRegion"
            label="Регионы"
            class="col-md-3 col-6"
            mode="single"
            :options="
              async () => {
                await this.FETCH_REGION_LIST();
                return this.REGION_LIST;
              }
            "
            @change="changeRegion"
          >
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
		<Radio
		v-model="form.ad_avito"
		:unselectMode="true"
		label="Авито"
		class="col pr-1 text-center"
		:options="yesNoOptions"
		/>
        </FormGroup>
      </Form>
    </Modal>
  </div>
</template>

<script>
import FormMixixn from "./mixins";
export default {
  name: "OfferSearchModalForm",
  mixins: [FormMixixn],
};
</script>

<style lang="scss">
.modal-header {
  div {
    position: relative;
    .badge {
      position: absolute;
      top: -10px;
      font-size: 14px;
      border-radius: 50%;
      padding: 0;
    }
  }
}
</style>