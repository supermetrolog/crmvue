<template>
  <div class="px-2 mb-3" :class="col">
    <div
      class="objects-item"
      :class="[
        {
          selected: selectedObjects.find((item) => item.id == object.id),
        },
        classList,
      ]"
    >
      <div class="header" :title="object.description || 'нет описания'">
        <div class="image">
          <span>{{ object.deal_type_name }}</span>
          <span
            class="duplicate_count"
            title="количество отправлений"
            v-if="object.duplicate_count > 1"
          >
            {{ object.duplicate_count }}
          </span>
          <div class="icon" @click.prevent="clickUnSelectObject">
            <i class="fas fa-check"></i>
          </div>
          <a href="#" @click.prevent="clickSelectObject">
            <img
              :src="
                object.building.photos
                  ? object.building.photos
                  : object.photos[0]
              "
              alt="Фото объекта"
            />
          </a>
        </div>
      </div>
      <div class="body">
        <div
          v-if="selectedObjects.find((item) => item.id == object.id)"
          class="comment p-0"
        >
          <textarea
            class="mb-1"
            v-model.trim="comment"
            ref="comment"
            rows="3"
            @blur="unfocusTextarea"
            @keypress.enter="enterTextarea"
            placeholder="Введите ваш комментарий"
          />
        </div>
        <div class="data py-2">
          <p class="text-center title">
            {{ object.district_name }} - {{ object.direction_name }}
          </p>
          <p class="value text-center title2">
            {{ object.object_type_name }}
          </p>
          <p class="value text-center text-success_alt">
            <i class="fas fa-square-full text-dark d-inline"></i>
            {{ object.area_min }} - {{ object.area_max }} м<sup>2</sup>
          </p>
          <p class="value text-center text-success_alt mt-1">
            <i class="fas fa-ruble-sign d-inline text-dark"></i>
            {{ object.price_floor_min }} - {{ object.price_floor_max }} р
          </p>
          <i
            class="far fa-arrow-alt-circle-down text-center mt-1 extra"
            @click="toggleExtraInfoVisible"
            v-if="!extraInfoVisible"
          ></i>
          <i
            class="far fa-arrow-alt-circle-up text-center mt-1 extra"
            @click="toggleExtraInfoVisible"
            v-if="extraInfoVisible"
          ></i>
        </div>

        <div class="extraFields text-center pb-2" v-if="extraInfoVisible">
          <p v-if="object.comment">комментарий</p>
          <p class="text-center value">
            {{ object.comment }}
          </p>
          <p>адрес</p>
          <p class="text-center value">
            {{ object.address }}
          </p>
          <p>брокер</p>
          <p class="text-center value">
            {{ object.agent_name }}
          </p>
          <p class="text-center value mt-1">
            <a
              class="text-primary"
              :href="`https://pennylane.pro/complex/${object.complex_id}?offer_id=[${object.original_id}]`"
              target="_blanc"
            >
              подробнее
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObjectsItem",
  data() {
    return {
      extraInfoVisible: false,
      comment: null,
    };
  },
  props: {
    object: {
      type: Object,
    },
    selectedObjects: {
      type: Array,
    },
    classList: {
      type: String,
      default() {
        return "";
      },
    },
    col: {
      type: String,
      default() {
        return "col-4";
      },
    },
  },
  methods: {
    toggleExtraInfoVisible() {
      this.extraInfoVisible = !this.extraInfoVisible;
    },
    clickSelectObject() {
      setTimeout(() => {
        this.$refs.comment.focus();
      });
      this.$emit("selectObject", this.object);
    },
    clickUnSelectObject() {
      this.$emit("unSelectObject", this.object);
    },
    enterTextarea() {
      this.$refs.comment.blur();
    },
    unfocusTextarea() {
      console.warn("fuck");
      if (this.comment) {
        this.$emit("selectObject", this.object, this.comment);
      }
    },
  },
  emits: ["selectObject", "unSelectObject"],
};
</script>

<style>
</style>