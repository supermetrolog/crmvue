<template>
  <tr
    class="text-center objects-item objects-item-table"
    :class="[
      {
        selected: isSelected,
      },
      classList,
    ]"
  >
    <td>
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
    </td>
    <td class="body">
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
      <div v-if="isSelected" class="comment px-1 mt-2">
        <textarea
          class="pb-0"
          v-model.trim="comment"
          ref="comment"
          rows="3"
          @blur="unfocusTextarea"
          @keypress.enter="enterTextarea"
          placeholder="Введите ваш комментарий"
        />
      </div>
    </td>
    <td class="body">
      <div class="flag"></div>
    </td>
    <td class="body px-1">
      <div class="last-block">
        <p class="text-center" v-if="object.comment">комментарий</p>
        <p class="text-center value text-success_alt">
          {{ object.comment }}
        </p>
        <p class="text-center">брокер</p>
        <p class="text-center value">
          {{ object.agent_name }}
        </p>
        <p class="text-center">адрес</p>
        <p class="text-center value">
          {{ object.address }}
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
    </td>
  </tr>
</template>

<script>
export default {
  name: "ObjectsItemTable",
  data() {
    return {
      extraInfoVisible: false,
      comment: this.object.comment,
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