<template>
  <div class="col company-form">
    <div class="row no-gutters">
      <div class="col">
        <div class="title">
          <p>- Отметить объекты, которые заинтересовали клиента при осмотре</p>
        </div>
        <div :class="{ 'scroll-list': interestObjects.length > 3 }">
          <button
            class="ml-1 action"
            :class="{ active: additional }"
            :disabled="disabled || additional"
            @click="clickAdditional"
          >
            <i class="far fa-frown-open"></i>
            <span class="ml-1">Ничего не подходит</span>
          </button>
          <button
            class="ml-1 action"
            :disabled="disabled"
            title="Отметить объекты"
            @click="clickSelectObjects"
          >
            <i class="fas fa-plus"></i>
          </button>
          <button
            class="ml-1 action active"
            v-for="object of interestObjects"
            :key="object.id"
            @click="clickOpenObjectInfo"
          >
            <span>{{ object.id }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col">
        <div class="title">
          <p>
            - Отметить объекты, по которым клиент планиурет вести переговоры
          </p>
        </div>
        <div :class="{ 'scroll-list': talkObjects.length > 3 }">
          <button
            class="ml-1 action"
            :class="{ active: negative }"
            :disabled="disabled || negative"
            @click="clickNegative"
          >
            <i class="far fa-frown-open"></i>
            <span class="ml-1">Отказался от переговоров</span>
          </button>
          <button
            class="ml-1 action"
            :disabled="disabled"
            title="Отметить объекты"
            @click="clickSelectObjects"
          >
            <i class="fas fa-plus"></i>
          </button>
          <button
            class="ml-1 action active"
            v-for="object of talkObjects"
            :key="object.id"
            @click="clickOpenObjectInfo"
          >
            <span>{{ object.id }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Interest",
  data() {
    return {
      negative: 0,
      additional: 0,
      interestObjects: [],
      talkObjects: [],
    };
  },
  props: {
    actions: {
      type: Object,
      default: () => {
        return {
          negative: 0,
          additional: 0,
          objects: [],
        };
      },
    },
    branch: {
      type: Number,
    },
    disabled: {
      type: Boolean,
    },
    isConfirmed: {
      type: Boolean,
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.negative = this.actions.negative;
      this.additional = this.actions.additional;
      this.interestObjects = this.actions.objects.filter(
        (item) => item.type == 1
      );
      this.talkObjects = this.actions.objects.filter((item) => item.type == 0);
    },
    getData() {
      return {
        negative: this.negative,
        additional: this.additional,
        objects: this.interestObjects.concat(this.talkObjects),
      };
    },
    clickNegative() {
      this.negative = 1;
      this.talkObjects = [];
    },
    clickAdditional() {
      this.additional = 1;
      this.interestObjects = [];
    },
  },
  watch: {
    disabled() {
      if (!this.isConfirmed) {
        this.setData();
      }
    },
  },
};
</script>

<style>
</style>