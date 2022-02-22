<template>
  <div
    class="row no-gutters objects-item-table mb-2"
    :class="[
      {
        selected: isSelected,
      },
      classList,
    ]"
  >
    <div class="col-3" :title="object.description || 'нет описания'">
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
              object.building.photos ? object.building.photos : object.photos[0]
            "
            alt="Фото объекта"
          />
        </a>
      </div>
    </div>
    <div class="col-4 align-self-center">
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
      <div v-if="isSelected" class="comment px-1">
        <textarea
          v-model.trim="localComment"
          ref="comment"
          rows="3"
          @blur="unfocusTextarea"
          @keypress.enter="enterTextarea"
          placeholder="Комментарий клиенту"
        />
      </div>
    </div>
    <div class="col-4 text-center align-self-center">
      <div>
        <p>брокер</p>
        <p class="value">
          {{ object.agent_name }}
        </p>
        <p>адрес</p>
        <p class="value">
          {{ object.address }}
        </p>
        <a
          :href="`https://pennylane.pro/complex/${object.complex_id}?offer_id=[${object.original_id}]`"
          target="_blanc"
        >
          подробнее
        </a>
        <a
          :href="`http://crmka/pdfs?original_id=${object.original_id}&type_id=${object.type_id}&consultant=Артур Мандрыка`"
          target="_blanc"
          class="d-block"
        >
          пдф
        </a>
        <a
          v-if="object.allComments && object.allComments.length"
          @click.prevent="toggleExtraInfoVisible"
          href="#"
        >
          комментарии
          <i class="fas fa-angle-down" v-if="!extraInfoVisible"></i>
          <i class="fas fa-angle-up" v-else></i>
        </a>
        <template v-if="extraInfoVisible">
          <p
            class="text-center value"
            :class="{
              'text-grey': !object.comments.find(
                (item) => item.timeline_step_id == comment.timeline_step_id
              ),
            }"
            v-for="comment in object.allComments"
            :key="comment.id"
          >
            {{ comment.comment }}
          </p>
        </template>
      </div>
    </div>
    <div class="col-1 align-self-center">
      <div class="flag ml-auto mr-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObjectsItemTable",
  data() {
    return {
      extraInfoVisible: false,
      localComment: null,
    };
  },
  props: {
    object: {
      type: Object,
    },
    isSelected: {
      type: Boolean,
      default: false,
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
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    toggleExtraInfoVisible() {
      this.extraInfoVisible = !this.extraInfoVisible;
    },
    clickSelectObject() {
      if (this.disabled) return;
      this.$emit("select", this.object);
      setTimeout(() => {
        this.$refs.comment.focus();
      });
    },
    clickUnSelectObject() {
      this.$emit("unSelect", this.object);
    },
    enterTextarea() {
      this.$refs.comment.blur();
    },
    unfocusTextarea() {
      this.$emit("addComment", this.object, this.localComment);
    },
  },
  mounted() {
    if (this.object.comment) {
      this.localComment = this.object.comment;
    }
  },
  watch: {
    object: {
      handler() {
        this.localComment = this.object.comment;
      },
      deep: true,
    },
  },
  emits: ["select", "unSelect", "addComment"],
};
</script>

<style>
</style>