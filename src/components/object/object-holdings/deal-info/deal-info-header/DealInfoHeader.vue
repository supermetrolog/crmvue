<template>
  <div class="deal-info-header">
    <p class="deal-info-header__text deal-info-header__text_color_red">
      <i class="fas fa-briefcase"></i>
      {{ company.name }}/{{ company.duration }}
      <span class="deal-info-header__text_size_small"
        >-
        {{
          company.projectAvailability ? "проект имеется" : "проекта нет"
        }}</span
      >
    </p>
    <ul class="deal-info-header__list">
      <li class="deal-info-header__item">
        <button class="deal-info-header__button" id="per_square_meter_per_year">
          м<sup>2</sup>/год
        </button>
        <button
          class="deal-info-header__button"
          id="per_square_meter_per_month"
        >
          м<sup>2</sup>/месяц
        </button>
        <button
          class="deal-info-header__button"
          id="per_month"
          :class="{ active: activeFilter === 'per_month' }"
        >
          в месяц
        </button>
      </li>
    </ul>
    <p class="deal-info-header__text">
      <i class="fas fa-walking"></i>
      {{ consultant.name }}
      <span class="deal-info-header__text_size_small"
        >/ {{ consultant.visitType }}</span
      >
    </p>
  </div>
</template>

<script>
export default {
  name: "DealInfoHeader",
  components: {},
  props: {
    company: {
      type: Object,
    },
    consultant: {
      type: Object,
    },
  },
  data() {
    return {
      activeFilter: "per_month",
    };
  },
};
</script>

<style lang="scss" src="./DealInfoHeader.scss"></style>
