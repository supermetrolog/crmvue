<template>
  <div class="button">
    <button
      class="action"
      :class="[
        {
          active: optionsLocale.btnActive,
        },
        optionsLocale.btnClass,
        { disabled: optionsLocale.disabled },
      ]"
      @click="clickBtn"
      v-if="!optionsLocale.extraVisible || optionsLocale.btnVisible"
      :title="optionsLocale.disabled ? 'нет доступа' : ''"
    >
      <slot name="btnContent"></slot>
    </button>

    <div
      class="actions d-inline-block text-center"
      v-if="optionsLocale.extraVisible"
    >
      <slot
        name="extraContent"
        :data="{ openned: optionsLocale.extraVisible }"
      ></slot>
      <div
        v-show="optionsLocale.extraVisible"
        :class="{ 'mt-1': optionsLocale.btnVisible }"
      >
        <textarea
          class="mb-1"
          v-model.trim="comment"
          @keypress.enter="confirm"
          ref="fuck"
        />
        <button class="btn-action text-success" @click="confirm">
          <i class="fas fa-check"></i>
        </button>
        <button class="btn-action text-danger" @click="cancel">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomButton",
  data() {
    return {
      comment: null,
      optionsLocale: {
        extraVisible: false,
        btnActive: false,
        btnVisible: true,
        btnClass: "",
        defaultBtn: false,
        disabled: false,
        ...this.options,
      },
    };
  },
  props: {
    options: {
      type: Object,
    },
  },
  methods: {
    clickBtn() {
      if (this.optionsLocale.disabled) {
        return;
      }
      if (this.optionsLocale.btnActive || this.optionsLocale.defaultBtn) {
        return this.$emit("confirm");
      }

      this.optionsLocale.extraVisible = true;
      setTimeout(() => {
        this.$refs.fuck.focus();
      });
    },
    cancel() {
      this.optionsLocale.extraVisible = false;
      this.comment = null;
    },
    confirm() {
      if (this.optionsLocale.disabled) {
        return;
      }
      this.optionsLocale.extraVisible = false;
      this.$emit("confirm", this.comment);
      this.comment = null;
    },
  },
  watch: {
    options() {
      this.optionsLocale = { ...this.optionsLocale, ...this.options };
    },
  },
};
</script>

<style>
</style>