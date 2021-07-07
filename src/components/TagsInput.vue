<template>
  <div class="tags-input-container">
    <div class="tags-input">
      <input
        type="text"
        :class="{ invalid: invalid }"
        v-model="newTag"
        @input="inputHandle"
        @keydown.enter.prevent="clickAddTag"
        v-maska="{
          mask: 'Z*',
          tokens: { Z: { pattern: /[0-9а-яА-Яa-zA-Z ]/ } },
        }"
      />
    </div>
    <div class="tag-list">
      <p
        class="tag-item text-center"
        v-for="(item, index) in tags"
        :key="index"
      >
        {{ item }}
        <i class="fas fa-times" @click="clickDeleteTag(index)"></i>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "tagsInput",
  data() {
    return {
      newTag: null,
    };
  },
  props: {
    tags: {
      type: Array,
    },
    tag: {
      type: String,
    },
    invalid: {
      type: Boolean,
    },
  },
  methods: {
    clickAddTag() {
      if (!this.newTag) return;
      this.$emit("addTag", this.newTag);
      this.newTag = null;
      console.log(this.tags);
    },
    clickDeleteTag(index) {
      this.$emit("deleteTag", index);
    },
  },
  emits: ["addTag", "deleteTag"],
};
</script>

<style>
</style>