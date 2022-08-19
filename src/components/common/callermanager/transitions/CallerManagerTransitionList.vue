<template>
  <div class="col-12 transition">
    <p class="title">Переходы</p>
    <div class="transition__list">
      <p
        class="transition__item"
        v-for="company in TRANSITION_LIST"
        :key="company.id"
        :title="company.officeAdress || 'нет адреса'"
      >
        <router-link :to="'/companies/' + company.id"
          ><i class="fas fa-eye"></i
        ></router-link>
        ID {{ company.id }} - {{ company.full_name }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CallerManagerTransitionList",
  computed: {
    ...mapGetters(["TRANSITION_LIST"]),
  },
};
</script>

<style>
</style>