<template>
  <div class="deal-info">
    <deal-info-header :company="company" :consultant="consultant" />
    <div class="deal-info__body">
      <div class="deal-info__content">
        <deal-detailed-info />
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

export default {
  name: "DealInfo",
  components: {
    DealInfoHeader,
    DealDetailedInfo,
    AdditionalDetails,
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
    };
  },
};
</script>

<style lang="scss" src="./DealInfo.scss"></style>
