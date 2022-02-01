<template>
  <div class="deal-item">
    <div class="row">
      <div class="col-12 text-center align-self-center mb-3">
        <i class="fas fa-handshake icon"></i>
      </div>
      <div class="col-12 px-0">
        <div class="row no-gutters">
          <div class="col-6 text-right pr-3"><p>название:</p></div>
          <div class="col-6 pl-3">
            <strong class="">{{ deal.name }}</strong>
          </div>
          <div class="col-6 text-right pr-3"><p>объект:</p></div>
          <div class="col-6 pl-3">
            <strong>
              <a
                :href="`https://pennylane.pro/complex/${deal.complex_id}?offer_id=[${deal.original_id}]`"
                target="_blanc"
              >
                #{{ deal.complex_id }}~{{ deal.object_id }}
              </a>
            </strong>
          </div>
          <div class="col-6 text-right pr-3"><p>площадь:</p></div>
          <div class="col-6 pl-3">
            <strong class="">{{ deal.area }} м<sup>2</sup></strong>
          </div>
          <div class="col-6 text-right pr-3"><p>цена пола (р):</p></div>
          <div class="col-6 pl-3">
            <strong class="">{{ deal.floorPrice || "-" }}</strong>
          </div>
          <div class="col-6 text-right pr-3"><p>консультант:</p></div>
          <div class="col-6 pl-3">
            <strong class="">{{ deal.consultant.username }}</strong>
          </div>
          <div class="col-6 text-right pr-3"><p>дата начала:</p></div>
          <div class="col-6 pl-3">
            <strong class="">{{ deal.startEventTime || "-" }}</strong>
          </div>
          <div class="col-6 text-right pr-3"><p>дата окончания:</p></div>
          <div class="col-6 pl-3">
            <strong class="">{{ deal.endEventTime || "-" }}</strong>
          </div>
          <div class="col-6 text-right pr-3"><p>юр. лицо клиента:</p></div>
          <div class="col-6 pl-3">
            <strong class="">{{ deal.clientLegalEntity || "-" }}</strong>
          </div>
          <div class="col-6 text-right pr-3"><p>описание:</p></div>
          <div class="col-6 pl-3">
            <strong class="">{{ deal.description || "-" }}</strong>
          </div>
          <div class="col-6 text-right pr-3" v-if="deal.is_competitor">
            <p>принадлежит компании:</p>
          </div>
          <div class="col-6 pl-3" v-if="deal.is_competitor">
            <strong class="">{{ deal.competitor_name || "-" }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DealItem",
  props: {
    deal: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 66px;
}
p {
  margin: 0;
}
.col-6 {
  align-self: center;
}
a {
  color: #11698e;
}
</style>