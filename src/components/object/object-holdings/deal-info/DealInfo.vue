<template>
  <div class="deal-info">
    <deal-info-header :company="company" :consultant="consultant" />
    <div class="deal-info__body">
      <div class="deal-info__content">
        <deal-detailed-info
          class="deal-info__detailed-info"
          :area="buildingInfo.area"
          :price="buildingInfo.price"
        />
        <trade-offer class="deal-info__trade-offer" />
      </div>
      <div class="deal-info__aside">
        <additional-details
          :label="additionalDetails.label"
          :exploitation="additionalDetails.exploitation"
          :communal="additionalDetails.communal"
          :extraCosts="additionalDetails.extraCosts"
          :specialTerms="additionalDetails.specialTerms"
          :business="additionalDetails.business"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DealDetailedInfo from "./deal-detailed-info/DealDetailedInfo.vue";
import AdditionalDetails from "./deal-detailed-info/additional-detailes/AdditionalDetails.vue";
import DealInfoHeader from "./deal-info-header/DealInfoHeader.vue";
import TradeOffer from "../../trade-offer/TradeOffer.vue";

export default {
  name: "DealInfo",
  components: {
    DealInfoHeader,
    DealDetailedInfo,
    AdditionalDetails,
    TradeOffer,
  },
  props: {},
  data() {
    return {
      company: {
        name: "BTS",
        duration: "36 мес.",
        projectAvailability: true,
      },
      consultant: {
        name: "Артур Мандрыка",
        visitType: "Личное посещение",
      },
      additionalDetails: {
        label: "Triple Net",
        exploitation: true,
        communal: false,
        extraCosts: [
          {
            label: "Орех",
            value: "890-1200",
            unitType: 8,
          },
          {
            label: "Ком платежи",
            value: "150-200",
            unitType: 8,
          },
        ],
        specialTerms: [
          {
            label: "Каникулы",
            value: "3-7",
            unitType: 10,
          },
          {
            label: "Депозит",
            value: "2",
            unitType: 10,
          },
          {
            label: "Залоговый пл.",
            value: "нет",
          },
        ],
        business: {
          type: "Арендный",
          info: [
            {
              label: "% заполняемости объекта",
              value: 80,
              unitType: 11,
            },
            {
              label: "Средняя ставка аренды",
              value: 7800,
              unitType: [9, 8],
            },
            {
              label: "% долгих контрактов",
              value: 80,
              unitType: 11,
            },
            {
              label: "Год последнего кап. ремон.",
              value: 2014,
              unitType: 12,
            },
            {
              label: "EBITDA",
              value: 47800000,
              unitType: 13,
            },
            {
              label: "Чистая прибыль",
              value: 35800000,
              unitType: 13,
            },
          ],
        },
      },
      buildingInfo: {
        area: {
          sum: {
            value: "2000 - 15000",
            unitType: 1,
          },
          list: [
            {
              label: "S - пол 1 эт.",
              value: "1000-3600",
              unitType: 1,
            },
            {
              label: "S - пол 2 эт.",
              value: "1000-3600",
              unitType: 1,
            },
            {
              label: "S - пол 3 эт.",
              value: "1000-3600",
              unitType: 1,
            },
            {
              label: "S - пол 6 эт.",
              value: "1920",
              unitType: 1,
            },
            {
              label: "S - мезон 1 яр.",
              value: "1000-3600",
              unitType: 1,
            },
            {
              label: "S - офисов",
              value: "1200-2000",
              unitType: 1,
            },
          ],
        },
        price: {
          sum: {
            value: "1200000 - 16500685",
            unitType: 9,
          },
          list: [
            {
              label: "E - пол 1 эт.",
              value: "500-800",
              unitType: 8,
            },
            {
              label: "E - пол 2 эт.",
              value: "6500-12000",
              unitType: 8,
            },
            {
              label: "E - пол 3 эт.",
              value: "1100000-16100000",
              unitType: 8,
            },
            {
              label: "E - пол 6 эт.",
              value: "2500-4500",
              unitType: 8,
            },
            {
              label: "E - мезон 1 яр.",
              value: "3250",
              unitType: 8,
            },
            {
              label: "E - офисов",
              value: null,
            },
          ],
        },
      },
    };
  },
};
</script>

<style lang="scss" src="./DealInfo.scss"></style>
