<template>
  <div class="object-offer only col-12" :class="{ passive: offer.status != 1 }">
    <div class="row no-gutters object-info">
      <div
        class="col-4 align-self-center"
        :title="offer.description || 'нет описания'"
      >
        <div class="image-container">
          <img :src="imageSrc" alt="image" />
        </div>
      </div>
      <div class="col-8 desc">
        <div class="item__title">
          <p>ID-{{ offer.object_id }}</p>
          <p>{{ $formatter.number(offer.area_building) }} м<sup>2</sup></p>
        </div>
        <div class="address">
          <p>{{ offer.address }}</p>
        </div>
        <div class="params">
          <div class="params__item">
            <p class="title">Этажи:</p>
            <p class="value">{{ offer.calc_floors }}</p>
          </div>
          <div class="params__item">
            <p class="title">Потолки:</p>
            <p class="value">{{ offer.calc_ceilingHeight }}</p>
          </div>
        </div>
        <div class="params">
          <div class="params__item">
            <p class="title">Электричество:</p>
            <p class="value">
              {{ $formatter.number(offer.power_value) }} <small>кВт</small>
            </p>
          </div>
          <div class="params__item">
            <p class="title">Тип ворот:</p>
            <p class="value">{{ offer.gate_type }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-12 text-center">
        <span class="object-offer__visual_id">{{ offer.visual_id }}</span>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-6 object-offer__area">
        <div class="row no-gutters">
          <div class="col-12 text-center">
            <p class="d-inline">S предложения</p>
            <h5 class="d-inline ml-2">
              {{ offer.calc_area_general }} <small>м<sup>2</sup></small>
            </h5>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>S - складская</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_area_warehouse }} <small>м<sup>2</sup></small>
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>S - 1 этаж</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_area_floor }} <small>м<sup>2</sup></small>
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>S - мезонин 1 ярус</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_area_mezzanine }} <small>м<sup>2</sup></small>
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>S - офисов</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_area_office }} <small>м<sup>2</sup></small>
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>S - тех</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_area_tech }} <small>м<sup>2</sup></small>
            </p>
          </div>
        </div>
      </div>
      <div class="col-6 object-offer__price">
        <div class="row no-gutters">
          <div class="col-12 text-center">
            <p class="d-inline">E предложения</p>
            <h5 class="d-inline ml-2">
              {{ offer.calc_price_general }}
              <small>руб</small>
            </h5>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>E - складская</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_price_warehouse
              }}<small> руб/м<sup>2</sup> год</small>
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>E - 1 этаж</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_price_floor }}
              <small>руб/м<sup>2</sup> год</small>
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>E - мезонин 1 ур</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_price_mezzanine }}
              <small>руб/м<sup>2</sup> год</small>
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7"><p>E - офисов</p></div>
          <div class="col-5">
            <p>
              {{ offer.calc_price_office }}
              <small>руб/м<sup>2</sup> год</small>
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-7">
            <p>
              Цена за м<small><sup>2</sup></small>
            </p>
          </div>
          <div class="col-5">
            <p>
              {{ offer.calc_price_sale }}
              <small>руб/м<sup>2</sup></small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyObjectItemOffer",
  props: {
    offer: {
      type: Object,
    },
  },
  computed: {
    imageSrc() {
      const photos = this.offer.photos;
      if (photos && Array.isArray(photos)) {
        return "https://pennylane.pro" + photos[0];
      }
      return "http://crmka/uploads/1.jpg";
    },
  },
};
</script>

<style>
</style>