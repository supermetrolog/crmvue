<template>
  <tr>
    <td>{{ idx + 1 }}</td>
    <td>
      <input
        type="text"
        :value="comming.full_name"
        name="full_name"
        :disabled="disabled"
      />
    </td>
    <td>
      <input
        type="text"
        :value="comming.birth_year"
        size="4"
        name="birth_year"
        :disabled="disabled"
      />
    </td>
    <td>
      <input
        type="text"
        :value="comming.phone"
        size="8"
        name="phone"
        :disabled="disabled"
      />
    </td>
    <td>
      <input
        type="text"
        :value="comming.call"
        size="4"
        name="call"
        :disabled="disabled"
      />
    </td>
    <td>
      <input
        type="text"
        :value="comming.lawyer"
        size="2"
        name="lawyer"
        :disabled="disabled"
      />
    </td>
    <td>
      <select name="theme" :disabled="disabled">
        <option
          v-for="theme in themeList"
          :key="theme.value"
          :value="theme.value"
          :selected="theme.value == comming.theme ? true : false"
        >
          {{ theme.name }}
        </option>
      </select>
    </td>
    <td>
      <select name="status" :disabled="disabled">
        <option
          v-for="status in statusList"
          :key="status.value"
          :value="status.value"
          :selected="status.value == comming.status ? true : false"
        >
          {{ status.name }}
        </option>
      </select>
    </td>
    <td>{{ comming.time }}</td>
    <td>
      <div class="disabledAction" v-if="disabled">
        <a class="btn-action" @click.prevent="toggleDisabled">
          <i class="fas fa-pencil-alt"></i>
        </a>
        <a class="btn-action second">
          <i class="fas fa-trash-alt"></i>
        </a>
      </div>
      <div class="undisabledAction" v-if="!disabled">
        <a class="btn-action">
          <i class="fas fa-check"></i>
        </a>
        <a
          class="btn-action second text-danger"
          @click.prevent="toggleDisabled"
        >
          <i class="fas fa-times"></i>
        </a>
      </div>
    </td>
  </tr>
</template>

<script>
import { DropdownList } from "@/const/Const";
export default {
  name: "TableItem",
  data() {
    return {
      themeList: DropdownList.get("comming_theme"),
      statusList: DropdownList.get("comming_status"),
      disabled: true,
    };
  },
  props: {
    comming: {
      type: Object,
    },
    idx: {
      type: Number,
    },
  },
  methods: {
    toggleDisabled() {
      this.disabled = !this.disabled;
    },
  },
};
</script>