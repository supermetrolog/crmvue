<template>
  <div class="activity-inputlist">
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Группа деятельности</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <select
              :class="{
                invalid: v.activityGroup.$error,
                valid:
                  v.activityGroup.$dirty &&
                  !v.activityGroup.$error &&
                  this.ACTIVITY.activityGroup,
              }"
              @change="v.activityGroup.$touch"
              v-model="this.ACTIVITY.activityGroup"
            >
              <option value="0">FUCK</option>
            </select>
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.activityGroup.$error"
          >
            <span>{{ v.activityGroup.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Профиль деятельности</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <select
              :class="{
                invalid: v.activityProfile.$error,
                valid:
                  v.activityProfile.$dirty &&
                  !v.activityProfile.$error &&
                  this.ACTIVITY.activityProfile,
              }"
              @change="v.activityProfile.$touch"
              v-model="this.ACTIVITY.activityProfile"
            >
              <option value="0">SUYCK</option>
            </select>
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.activityProfile.$error"
          >
            <span>{{ v.activityProfile.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Номенклатура товара</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <!-- <input
              type="text"
              :class="{
                invalid: v.activityProfile.$error,
                valid:
                  v.activityProfile.$dirty &&
                  !v.activityProfile.$error &&
                  this.ACTIVITY.activityProfile,
              }"
              @input="v.activityProfile.$touch"
              v-model="this.ACTIVITY.activityProfile"
            /> -->
            <TagsInput
              :invalid="v.productRange.$error"
              @addTag="clickAddTag"
              @deleteTag="clickDeleteTag"
              :tags="this.ACTIVITY.productRange"
            />
          </div>
          <div
            class="col-12 text-center error-container pt-1 pb-0"
            v-if="v.productRange.$error"
          >
            <span>{{ v.productRange.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-group row no-gutters">
      <div class="col-4">
        <label class="input-label">Описание</label>
      </div>
      <div class="col-8 pl-4">
        <div class="row">
          <div class="col-12">
            <textarea type="text" v-model="this.ACTIVITY.description" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TagsInput from "@/components/TagsInput";
export default {
  name: "ActivityInputList",
  components: {
    TagsInput,
  },
  props: {
    v: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["ACTIVITY"]),
  },
  methods: {
    ...mapActions(["ADD_PRODUCT_RANGE_ITEM", "DELETE_PRODUCT_RANGE_ITEM"]),
    test() {
      console.log(this.REQUISISTES.nameEng);
    },
    clickAddTag(newTag) {
      this.ADD_PRODUCT_RANGE_ITEM(newTag);
    },
    clickDeleteTag(index) {
      this.DELETE_PRODUCT_RANGE_ITEM(index);
    },
  },
};
</script>

<style>
</style>